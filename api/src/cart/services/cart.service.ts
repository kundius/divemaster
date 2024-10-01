import { EntityManager, EntityRepository, ObjectQuery, QueryOrder, wrap } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { CartProduct } from '../entities/cart-product.entity'
import { Cart } from '../entities/cart.entity'
import { User } from '@/users/entities/user.entity'
import { Product } from '@/products/entities/product.entity'
import { ConfigService } from '@nestjs/config'
import {
  AddProductDto,
  CreateOrderDto,
  GetOrderCostDto,
  TemporaryCreateOrderDto,
  UpdateProductDto
} from '../dto/cart.dto'
import { Order } from '@/order/entities/order.entity'
import { OrderProduct } from '@/order/entities/order-product.entity'
import { content as letterNewToManager } from '@/notifications/templates/order/new-to-manager'
import { Offer } from '@/products/entities/offer.entity'
import { v4 } from 'uuid'
import { Delivery, DeliveryService } from '@/order/entities/delivery.entity'
import { Payment, PaymentServiceEnum } from '@/order/entities/payment.entity'
import { LazyModuleLoader } from '@nestjs/core'
import { OrderService } from '@/order/services/order.service'
import { PickupPointService } from '@/order/services/pickup-point.service'
import { PickupPointTypeEnum } from '@/order/entities/pickup-point.entity'

@Injectable()
export class CartService {
  constructor(
    private orderService: OrderService,
    private pickupPointService: PickupPointService,
    private configService: ConfigService,
    private em: EntityManager,
    @InjectRepository(Cart)
    private cartRepository: EntityRepository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: EntityRepository<CartProduct>,
    @InjectRepository(Product)
    private productRepository: EntityRepository<Product>
  ) {}

  async createCart(user?: User) {
    if (user && user.cart) {
      return user.cart
    }

    const cart = new Cart()
    cart.user = user || null

    await this.cartRepository.getEntityManager().persistAndFlush(cart)

    return cart
  }

  async authorizeCart(cartId: string, user: User) {
    const cart = await this.cartRepository.findOneOrFail(cartId)

    if (!cart.user) {
      cart.user = user
      await this.cartRepository.getEntityManager().persistAndFlush(cart)
    }
  }

  async deleteCart(cartId: string) {
    const cart = await this.cartRepository.findOneOrFail(cartId)

    await this.cartRepository.getEntityManager().removeAndFlush(cart)
  }

  async applyProductAssessment(cartProduct: CartProduct) {
    // TODO
    // инициализированные здесь отношения не попадают в итоговый результат,
    // то есть в тот массив, откуда пришел cartProduct
    // непонятно почему так, надо будет разобраться
    await wrap(cartProduct).init({
      populate: ['optionValues', 'product', 'product.offers', 'product.offers.optionValues']
    })

    const cartProductIds = cartProduct.optionValues.getIdentifiers()

    // сортируем офферы по количеству опций
    const sortedOffers = cartProduct.product.offers
      .getItems()
      .sort((a, b) => {
        if (a.optionValues.length < b.optionValues.length) return -1
        if (a.optionValues.length > b.optionValues.length) return 1
        return 0
      })
      .reverse()
    const basicOffer = sortedOffers.find(
      (offer) => offer.optionValues && offer.optionValues.length === 0
    )
    const additionalOffers = sortedOffers.filter(
      (offer) => offer.optionValues && offer.optionValues.length > 0
    )

    // Если дополнительных нет, то выбираем базовый независимо от выбранных опций
    // Если есть дополнительные, то выбираем среди них соответствующий опциям
    let selectedOffer: Offer | undefined = undefined
    if (additionalOffers.length === 0) {
      selectedOffer = basicOffer
    } else {
      selectedOffer = additionalOffers.find((offer) => {
        const offerIds = offer.optionValues.getIdentifiers()
        return offerIds.every((id) => cartProductIds.includes(id))
      })
    }

    // если торговое предложение не найдено, то позицию в корзине помечаем неактивной,
    // дальше считать стоимость нет смысла
    if (!selectedOffer) {
      this.cartProductRepository.assign(cartProduct, {
        active: false
      })
      return
    }

    this.cartProductRepository.assign(cartProduct, {
      active: true
    })

    // считаем стоимость позиции с учетом скидок
    // расчет скидок выполнить здесь
    this.cartProductRepository.assign(cartProduct, {
      price: selectedOffer.price
    })

    // тут пока так, но с добавлением скидок нужно объеденить в старую цену и скидки и статичное снижение стоимости
    if (cartProduct.product.priceDecrease) {
      this.cartProductRepository.assign(cartProduct, {
        oldPrice:
          selectedOffer.price * (cartProduct.product.priceDecrease / 100) + selectedOffer.price
      })
    }
  }

  async findProducts(cartId: string) {
    const products = await this.cartProductRepository.find(
      {
        cart: cartId
      },
      {
        populate: ['product', 'product.images', 'optionValues', 'optionValues.option'],
        populateOrderBy: { product: { images: { rank: QueryOrder.ASC } } },
        populateWhere: { product: { images: { active: true } } },
        orderBy: { createdAt: 'DESC' }
      }
    )

    await Promise.all(products.map(this.applyProductAssessment.bind(this)))

    return products
  }

  async addProduct(cartId: string, dto: AddProductDto) {
    const cart = await this.cartRepository.findOneOrFail(cartId)
    const product = await this.productRepository.findOneOrFail(dto.id)
    const cartProducts = await this.cartProductRepository.find(
      { cart, product },
      { populate: ['optionValues'] }
    )

    // Найти в корзине товар с такими же опциями
    const cartProduct = cartProducts.find((cartProduct) => {
      if (dto.optionValues && dto.optionValues.length) {
        const identifiers = cartProduct.optionValues.getIdentifiers()
        return dto.optionValues.every((id) => identifiers.includes(id))
      }
      return cartProduct.optionValues.isEmpty()
    })

    // Увеличить количество, если найден, или добавить новый
    if (cartProduct) {
      cartProduct.quantity += dto.quantity || 1
      await this.cartProductRepository.getEntityManager().persistAndFlush(cartProduct)
    } else {
      const cartProduct = new CartProduct()
      this.cartProductRepository.assign(cartProduct, {
        product,
        cart,
        quantity: dto.quantity || 1,
        optionValues: dto.optionValues || []
      })
      await this.cartProductRepository.getEntityManager().persistAndFlush(cartProduct)
    }

    return this.findProducts(cartId)
  }

  async updateProduct(cartId: string, productId: string, dto: UpdateProductDto) {
    const cartProduct = await this.cartProductRepository.findOneOrFail(productId)

    if (dto.quantity) {
      cartProduct.quantity = dto.quantity
    }

    await this.cartProductRepository.getEntityManager().persistAndFlush(cartProduct)

    return this.findProducts(cartId)
  }

  async deleteProduct(cartId: string, productId: string) {
    const cartProduct = await this.cartProductRepository.findOneOrFail(productId)

    await this.cartProductRepository.getEntityManager().removeAndFlush(cartProduct)

    return this.findProducts(cartId)
  }

  async getOrderCost(cartId: string, dto?: GetOrderCostDto) {
    const cart = await this.cartRepository.findOneOrFail(cartId, {
      populate: ['user', 'products']
    })
    await Promise.all(cart.products.map(this.applyProductAssessment.bind(this)))

    const composition: { caption: string; name: string; value: number }[] = []
    const quantity = cart.products.reduce((sum, { quantity }) => sum + quantity, 0)
    let cost = cart.products.reduce((sum, { price = 0, quantity }) => sum + price * quantity, 0)

    const cartCost = cart.products.reduce(
      (sum, { quantity, price = 0, oldPrice = 0 }) => sum + (oldPrice || price) * quantity,
      0
    )

    composition.push({
      name: 'goods',
      caption: `Товары, ${quantity} шт.`,
      value: cartCost
    })

    // Если не равны, есть товары со скидками
    if (cartCost !== cost) {
      composition.push({
        name: 'discounts',
        caption: `Скидки и акции`,
        value: cost - cartCost
      })
    }

    // Персональная скидка
    if (dto?.personalDiscount && cart.user && cart.user.discount > 0) {
      const discountValue = Math.round(cost * (cart.user.discount / 100)) * -1
      composition.push({
        name: 'personal',
        caption: `Персональная скидка ${cart.user.discount}%`,
        value: discountValue
      })
      cost += discountValue
    }

    // TODO
    // Стоимость доставки, пока примитивная
    if (dto?.deliveryService) {
      switch (dto.deliveryService) {
        case DeliveryService.Shipping:
        case DeliveryService.Pickup:
          console.log('deliveryProperties', dto.deliveryProperties?.pickupPointId)
          let inStore = false
          if (dto.deliveryProperties?.pickupPointId) {
            const pickupPoint = await this.pickupPointService.findOne(
              String(dto.deliveryProperties.pickupPointId)
            )
            if (pickupPoint) {
              inStore = pickupPoint.type === PickupPointTypeEnum.store
            }
          }
          if (!inStore && cost < Number(this.configService.get('DELIVERY_FREE_LIMIT', '0'))) {
            composition.push({
              name: 'delivery',
              caption: `Доставка`,
              value: Number(this.configService.get('DELIVERY_COST', '0'))
            })
            cost += Number(this.configService.get('DELIVERY_COST', '0'))
          }
          break
        default:
          throw new Error(`Non-existent delivery service: ${dto.deliveryService}`)
      }
    }

    // TODO
    // Стоимость оплаты, вынести в сервис
    if (dto?.paymentService) {
      switch (dto.paymentService) {
        case PaymentServiceEnum.UponCash:
        case PaymentServiceEnum.Yookassa:
          break
        default:
          throw new Error(`Non-existent payment service: ${dto.deliveryService}`)
      }
    }

    return { cost, composition }
  }

  async createOrder(cartId: string, dto: CreateOrderDto) {
    // получить корзину с необходимыми отношениями
    const cart = await this.cartRepository.findOneOrFail(cartId, {
      populate: [
        'user',
        'products',
        'products.optionValues',
        'products.optionValues.option',
        'products.product'
      ]
    })

    // получить стоимость товаров корзины, понадобится для создания товаров заказа
    await Promise.all(cart.products.map(this.applyProductAssessment.bind(this)))

    // получить стоимость заказа
    const orderCost = await this.getOrderCost(cartId, {
      personalDiscount: dto.personalDiscount,
      deliveryService: dto.deliveryService,
      paymentService: dto.paymentService
    })

    // создать оплату
    const payment = new Payment()
    payment.service = dto.paymentService
    this.em.persist(payment)

    // создать доставку
    const delivery = new Delivery()
    delivery.service = dto.deliveryService
    delivery.address = dto.deliveryAddress
    delivery.recipient = {
      name: dto.recipientName,
      email: dto.recipientEmail,
      phone: dto.recipientPhone
    }
    this.em.persist(delivery)

    // создать заказ
    const order = new Order()
    order.hash = v4()
    order.cost = orderCost.cost
    order.composition = orderCost.composition
    order.delivery = delivery
    order.payment = payment
    order.user = cart.user
    this.em.persist(order)

    // добавить к заказу товары из корзины
    for (const cartProduct of cart.products) {
      if (typeof cartProduct.price === 'undefined' || !cartProduct.active) continue

      const options = cartProduct.optionValues.reduce<Record<string, string>>(
        (options, optionValue) => {
          return {
            ...options,
            [optionValue.option.caption]: optionValue.content
          }
        },
        {}
      )

      const orderProduct = new OrderProduct()
      orderProduct.order = order
      orderProduct.options = options
      orderProduct.quantity = cartProduct.quantity
      orderProduct.price = cartProduct.price
      orderProduct.title = cartProduct.product.title
      orderProduct.product = cartProduct.product
      this.em.persist(orderProduct)
    }

    // записать изменения
    await this.em.flush()

    // получить ссылку на оплату
    await this.orderService.processPayment(payment)

    // отправить письмо
    await this.orderService.sendEmails(order)

    return wrap(order).serialize({
      populate: ['payment', 'delivery']
    })
  }
}

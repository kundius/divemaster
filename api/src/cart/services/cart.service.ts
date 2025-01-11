import { OrderService } from '@/order/services/order.service'
import { PickupPointService } from '@/order/services/pickup-point.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 } from 'uuid'
import { AddProductDto, CreateOrderDto, GetOrderCostDto, UpdateProductDto } from '../dto/cart.dto'
import { Cart } from '../entities/cart.entity'
import { CartProduct } from '../entities/cart-product.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '@/users/entities/user.entity'
import { Offer } from '@/products/entities/offer.entity'
import { OptionValue } from '@/products/entities/option-value.entity'
import { Delivery, DeliveryService } from '@/order/entities/delivery.entity'
import { PickupPointTypeEnum } from '@/order/entities/pickup-point.entity'
import { Payment, PaymentServiceEnum } from '@/order/entities/payment.entity'
import { Order } from '@/order/entities/order.entity'
import { OrderProduct } from '@/order/entities/order-product.entity'

type ProductAssessment =
  | {
      active: false
      price: undefined
      oldPrice: undefined
    }
  | {
      active: true
      price: number
      oldPrice?: number
    }

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: Repository<CartProduct>,
    @InjectRepository(OptionValue)
    private optionValueRepository: Repository<OptionValue>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: Repository<OrderProduct>,
    private orderService: OrderService,
    private pickupPointService: PickupPointService,
    private configService: ConfigService
  ) {}

  async createCart(user?: User) {
    if (user) {
      const userCart = await this.cartRepository.findOne({ where: { userId: user.id } })
      if (userCart) {
        return userCart
      }
    }

    const cart = new Cart()

    if (user) {
      cart.user = user
    }

    await this.cartRepository.save(cart)

    return cart
  }

  async authorizeCart(cartId: string, user: User) {
    const cart = await this.cartRepository.findOneOrFail({
      where: { id: cartId },
      relations: { user: true }
    })

    if (!cart.user) {
      cart.user = user
      await this.cartRepository.save(cart)
    }
  }

  async deleteCart(cartId: string) {
    await this.cartRepository.delete({ id: cartId })
  }

  async getCartProductAssessment(cartProductId: string): Promise<ProductAssessment> {
    const cartProduct = await this.cartProductRepository.findOneOrFail({
      where: { id: cartProductId },
      relations: {
        optionValues: true,
        product: { offers: { optionValues: true } }
      }
    })
    const cartProductOptionValuesIds = cartProduct.optionValues.map((item) => item.id)

    // сортируем офферы по количеству опций
    const sortedOffers = cartProduct.product.offers
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
        const offerIds = offer.optionValues
        return offerIds.every((item) => cartProductOptionValuesIds.includes(item.id))
      })
    }

    // если торговое предложение не найдено, то позицию в корзине помечаем неактивной,
    // дальше считать стоимость нет смысла
    if (!selectedOffer) {
      return {
        active: false,
        price: undefined,
        oldPrice: undefined
      }
    }

    // считаем стоимость позиции с учетом скидок
    // расчет скидок выполнить здесь
    const price: number = selectedOffer.price
    let oldPrice: number | undefined = undefined

    // тут пока так, но с добавлением скидок нужно объединить в старую цену и скидки и статичное снижение стоимости
    if (cartProduct.product.priceDecrease) {
      oldPrice =
        selectedOffer.price * (cartProduct.product.priceDecrease / 100) + selectedOffer.price
    }

    return {
      active: true,
      price,
      oldPrice
    }
  }

  async findProducts(cartId: string) {
    const products = await this.cartProductRepository.find({
      where: {
        product: { images: { active: true } },
        cartId
      },
      relations: {
        product: { images: true },
        optionValues: { option: true }
      },
      order: {
        product: { images: { rank: 'asc' } },
        createdAt: 'desc'
      }
    })

    await Promise.all(
      products.map(async (item) => {
        const assessment = await this.getCartProductAssessment(item.id)
        item.active = assessment.active
        item.oldPrice = assessment.oldPrice
        item.price = assessment.price
      })
    )

    return products
  }

  async addProduct(cartId: string, dto: AddProductDto) {
    const cartProducts = await this.cartProductRepository.find({
      where: {
        cartId,
        productId: dto.id
      },
      relations: {
        optionValues: true
      }
    })

    // Найти в корзине товар с такими же опциями
    let cartProduct = cartProducts.find((cartProduct) => {
      if (dto.optionValues && dto.optionValues.length) {
        const identifiers = cartProduct.optionValues.map((item) => item.id)
        return dto.optionValues.every((id) => identifiers.includes(id))
      }
      return cartProduct.optionValues.length === 0
    })

    // Увеличить количество, если найден, или добавить новый
    if (cartProduct) {
      cartProduct.quantity = cartProduct.quantity + (dto.quantity || 1)
      await this.cartProductRepository.save(cartProduct)
    } else {
      cartProduct = new CartProduct()
      cartProduct.quantity = dto.quantity || 1
      cartProduct.cartId = cartId
      cartProduct.productId = dto.id
      cartProduct.optionValues = await Promise.all(
        (dto.optionValues || []).map(async (id) =>
          this.optionValueRepository.findOneByOrFail({ id })
        )
      )
      await this.cartProductRepository.save(cartProduct)
    }

    return this.findProducts(cartId)
  }

  async updateProduct(cartId: string, id: string, dto: UpdateProductDto) {
    if (dto.quantity) {
      await this.cartProductRepository.update({ id }, { quantity: dto.quantity })
    }

    return this.findProducts(cartId)
  }

  async deleteProduct(cartId: string, id: string) {
    await this.cartProductRepository.delete({ id })

    return this.findProducts(cartId)
  }

  async getOrderCost(cartId: string, dto?: GetOrderCostDto) {
    const cart = await this.cartRepository.findOneOrFail({
      where: { id: cartId },
      relations: {
        user: true,
        products: true
      }
    })

    let quantity = 0
    let cost = 0
    let cartCost = 0
    for (const cartProduct of cart.products) {
      const { price, oldPrice, active } = await this.getCartProductAssessment(cartProduct.id)
      if (active) {
        quantity += cartProduct.quantity
        cost += price * cartProduct.quantity
        cartCost += (oldPrice || price) * cartProduct.quantity
      }
    }

    const composition: { caption: string; name: string; value: number }[] = []

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
    const cart = await this.cartRepository.findOneOrFail({
      where: { id: cartId },
      relations: {
        user: true
      }
    })

    // получить стоимость заказа
    const orderCost = await this.getOrderCost(cartId, {
      personalDiscount: dto.personalDiscount,
      deliveryService: dto.deliveryService,
      paymentService: dto.paymentService
    })

    // создать заказ
    const order = new Order()
    this.orderRepository.merge(order, {
      hash: v4(),
      cost: orderCost.cost,
      composition: orderCost.composition,
      user: cart.user
    })
    await this.orderRepository.save(order)

    // создать оплату
    const payment = new Payment()
    this.paymentRepository.merge(payment, {
      service: dto.paymentService,
      order
    })
    await this.paymentRepository.save(payment)

    // создать доставку
    const delivery = new Delivery()
    this.deliveryRepository.merge(delivery, {
      service: dto.deliveryService,
      address: dto.deliveryAddress,
      recipient: {
        name: dto.recipientName,
        email: dto.recipientEmail,
        phone: dto.recipientPhone
      },
      order
    })
    await this.deliveryRepository.save(delivery)

    // добавить к заказу товары из корзины
    const cartProducts = await this.cartProductRepository.find({
      where: { cartId },
      relations: {
        product: true,
        optionValues: { option: true }
      }
    })
    for (const cartProduct of cartProducts) {
      const productAssessment = await this.getCartProductAssessment(cartProduct.id)

      if (typeof productAssessment.price === 'undefined' || !productAssessment.active) continue

      const options = cartProduct.optionValues.reduce<Record<string, string>>((options, item) => {
        return {
          ...options,
          [item.option.caption]: item.content
        }
      }, {})

      const record = new OrderProduct()
      this.orderProductRepository.merge(record, {
        order,
        product: cartProduct.product,
        options: options,
        quantity: cartProduct.quantity,
        price: productAssessment.price,
        title: cartProduct.product.title
      })
      await this.orderProductRepository.save(record)
    }

    // получить ссылку на оплату
    await this.orderService.processPayment(payment)

    // отправить письмо
    await this.orderService.sendEmails(order)

    return {
      ...order,
      payment,
      delivery
    }
  }
}

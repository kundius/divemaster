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
  GetOrderCostDto,
  TemporaryCreateOrderDto,
  UpdateProductDto
} from '../dto/cart.dto'
import { Order } from '@/order/entities/order.entity'
import { OrderProduct } from '@/order/entities/order-product.entity'
import { LetterService } from '@/notifications/services/letter.service'
import { content as letterNewToManager } from '@/notifications/templates/order/new-to-manager'
import { Offer } from '@/products/entities/offer.entity'
import { performance } from 'node:perf_hooks'

@Injectable()
export class CartService {
  constructor(
    private letterService: LetterService,
    private configService: ConfigService,
    private em: EntityManager,
    @InjectRepository(Cart)
    private cartRepository: EntityRepository<Cart>,
    @InjectRepository(CartProduct)
    private cartProductRepository: EntityRepository<CartProduct>,
    @InjectRepository(Order)
    private orderRepository: EntityRepository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: EntityRepository<OrderProduct>,
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

  async calcProduct(cartProduct: CartProduct) {
    // TODO
    // инициализированные здесь отношения не попадают в итоговый результат,
    // то есть в тот массив, откуда пришел cartProduct
    // непонятно почему так, надо будет разобраться
    await wrap(cartProduct).init({
      populate: [
        'optionValues',
        'product',
        'product.offers',
        'product',
        'product.offers.optionValues'
      ]
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

    await Promise.all(products.map(this.calcProduct.bind(this)))

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
      cartProduct.amount += dto.amount || 1
      await this.cartProductRepository.getEntityManager().persistAndFlush(cartProduct)
    } else {
      const cartProduct = new CartProduct()
      this.cartProductRepository.assign(cartProduct, {
        product,
        cart,
        amount: dto.amount || 1,
        optionValues: dto.optionValues || []
      })
      await this.cartProductRepository.getEntityManager().persistAndFlush(cartProduct)
    }

    return this.findProducts(cartId)
  }

  async updateProduct(cartId: string, productId: string, dto: UpdateProductDto) {
    const cartProduct = await this.cartProductRepository.findOneOrFail(productId)

    if (dto.amount) {
      cartProduct.amount = dto.amount
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
    const cart = await this.cartRepository.findOneOrFail(cartId, { populate: ['user'] })
    const products = await this.cartProductRepository.find({ cart: cartId })
    await Promise.all(products.map(this.calcProduct.bind(this)))

    let composition: { name: string; value: number }[] = []
    let cost = products.reduce((sum, { price = 0, amount }) => sum + price * amount, 0)

    const cartAmount = products.reduce((sum, { amount }) => sum + amount, 0)
    const cartCost = products.reduce(
      (sum, { amount, price = 0, oldPrice = 0 }) => sum + (oldPrice || price) * amount,
      0
    )

    composition.push({
      name: `Товары, ${cartAmount} шт.`,
      value: cartCost
    })

    // Если не равны, есть товары со скидками
    if (cartCost !== cost) {
      composition.push({
        name: `Скидки и акции`,
        value: cost - cartCost
      })
    }

    // Персональная скидка
    if (dto?.personalDiscount && cart.user && cart.user.discount > 0) {
      const discountValue = Math.round(cost * (cart.user.discount / 100)) * -1
      composition.push({
        name: `Персональная скидка ${cart.user.discount}%`,
        value: discountValue
      })
      cost += discountValue
    }

    // Стоимость доставки, пока примитивная
    if (dto?.deliveryMethod && cost < Number(this.configService.get('DELIVERY_FREE_LIMIT', '0'))) {
      composition.push({
        name: `Доставка`,
        value: Number(this.configService.get('DELIVERY_COST', '0'))
      })
      cost += Number(this.configService.get('DELIVERY_COST', '0'))
    }

    return { cost, composition }
  }

  async createOrder(cartId: string, dto?: GetOrderCostDto, user?: User) {}

  async temporaryCreateOrder(cartId: string, dto: TemporaryCreateOrderDto, user?: User) {
    const products = await this.findProducts(cartId)

    const order = new Order()
    this.orderRepository.assign(order, {
      cost: 0,
      recipient: {
        email: dto.customerEmail,
        mame: dto.customerName,
        phone: dto.customerPhone
      }
    })

    if (user) {
      order.user = user
    }

    this.orderRepository.getEntityManager().persist(order)

    for (const cartProduct of products) {
      if (typeof cartProduct.price === 'undefined') continue

      order.cost += (cartProduct.price || 0) * cartProduct.amount

      let options: Record<string, string> = {}
      for (const optionValue of cartProduct.optionValues) {
        options[optionValue.option.caption] = optionValue.content
      }

      const orderProduct = new OrderProduct()
      this.orderProductRepository.assign(orderProduct, {
        options,
        amount: cartProduct.amount,
        price: cartProduct.price,
        product: cartProduct.product
      })
      this.orderProductRepository.getEntityManager().persist(orderProduct)

      order.products.add(orderProduct)
    }

    await this.orderRepository.getEntityManager().flush()

    await this.letterService.sendLetter({
      to: 'kundius.ruslan@gmail.com',
      subject: `Новый заказ №${order.id}`,
      html: letterNewToManager({
        fullName: order.recipient?.name || order.user?.name || 'Гость'
      })
    })

    return order
  }
}

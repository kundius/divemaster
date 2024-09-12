import { EntityRepository, ObjectQuery, QueryOrder, wrap } from '@mikro-orm/mariadb'
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

@Injectable()
export class CartService {
  constructor(
    private letterService: LetterService,
    private configService: ConfigService,
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
    const cartProductIds = cartProduct.optionValues.getIdentifiers()
    await cartProduct.product.offers.init({
      populate: ['optionValues']
    })
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

    // если торговое предложение не найдено, то позиция в корзине считается неактивной
    this.cartProductRepository.assign(cartProduct, {
      active: !!selectedOffer
    })

    // если торговое предложение найдено, то считаем стоимость позиции с учетом скидок
    if (selectedOffer) {
      // расчет скидок выполнить здесь
      this.cartProductRepository.assign(cartProduct, {
        price: selectedOffer.price
      })
    }

    // тут пока так, но с добавлением скидок нужно объеденить в старую цену и скидки и статичное снижение стоимости
    if (selectedOffer && cartProduct.product.priceDecrease) {
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
      {
        populate: ['optionValues']
      }
    )
    const cartProduct = cartProducts.find((cartProduct) => {
      if (dto.optionValues && dto.optionValues.length) {
        const identifiers = cartProduct.optionValues.getIdentifiers()
        return dto.optionValues.every((id) => identifiers.includes(id))
      }
      return cartProduct.optionValues.isEmpty()
    })

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
    const cart = await this.cartRepository.findOne(cartId, {
      populate: ['user']
    })
    const products = await this.cartProductRepository.find(
      { cart: cartId },
      { populate: ['product', 'optionValues', 'optionValues.option'] }
    )

    await Promise.all(products.map(this.calcProduct.bind(this)))

    console.log(products)
    let composition: {
      name: string
      value: number
    }[] = []
    let cost = 0

    let totalCount = 0
    let totalCost = 0
    for (const product of products) {
      totalCount += product.amount
      totalCost += (product.oldPrice || product.price || 0) * product.amount
    }
    composition.push({
      name: `Товары, ${totalCount} шт.`,
      value: totalCost
    })
    cost += totalCost

    return {
      cost,
      composition
    }

    return {
      cost: 777,
      composition: [
        {
          name: `Товары, ${totalCount} шт.`,
          value: totalCost
        },
        {
          name: 'Скидки и акции',
          value: -777
        },
        {
          name: 'Персональная скидка 5%',
          value: -777
        },
        {
          name: 'Купон ХХХХ',
          value: -777
        },
        {
          name: 'Доставка',
          value: 777
        },
        {
          name: 'Наложенный платеж',
          value: 777
        }
      ]
    }
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

      order.cost += cartProduct.price * cartProduct.amount

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

import { OrderService } from '@/order/services/order.service'
import { PickupPointService } from '@/order/services/pickup-point.service'
import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { $Enums, Offer, User } from '@prisma/client'
import { v4 } from 'uuid'
import { AddProductDto, CreateOrderDto, GetOrderCostDto, UpdateProductDto } from '../dto/cart.dto'

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
    private readonly prismaService: PrismaService,
    private orderService: OrderService,
    private pickupPointService: PickupPointService,
    private configService: ConfigService
  ) {}

  async createCart(user?: User) {
    if (user) {
      const cart = await this.prismaService.cart.findUnique({
        where: { user_id: user.id }
      })
      if (cart) {
        return cart
      }
    }

    const cart = await this.prismaService.cart.create({
      data: {
        id: v4(),
        user: user ? { connect: { id: user.id } } : undefined
      }
    })

    return cart
  }

  async authorizeCart(cartId: string, user: User) {
    const cart = await this.prismaService.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: { user: true }
    })

    if (!cart.user) {
      await this.prismaService.cart.update({
        where: { id: cartId },
        data: { user: { connect: { id: user.id } } }
      })
    }
  }

  async deleteCart(cartId: string) {
    await this.prismaService.cart.delete({ where: { id: cartId } })
  }

  async getCartProductAssessment(cartProductId: string): Promise<ProductAssessment> {
    const cartProduct = await this.prismaService.cartProduct.findUniqueOrThrow({
      where: { id: cartProductId },
      include: {
        optionValues: {
          include: { optionValue: true }
        },
        product: {
          include: {
            offers: {
              include: {
                optionValues: {
                  include: { optionValue: true }
                }
              }
            }
          }
        }
      }
    })
    const cartProductOptionValuesIds = cartProduct.optionValues.map((item) => item.optionValue.id)

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
        return offerIds.every((item) => cartProductOptionValuesIds.includes(item.optionValue.id))
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
    if (cartProduct.product.price_decrease) {
      oldPrice =
        selectedOffer.price * (cartProduct.product.price_decrease / 100) + selectedOffer.price
    }

    return {
      active: true,
      price,
      oldPrice
    }
  }

  async findProducts(cartId: string) {
    const products = await this.prismaService.cartProduct.findMany({
      where: { cart_id: cartId },
      include: {
        product: {
          include: {
            images: {
              orderBy: { rank: 'asc' },
              where: { active: true }
            }
          }
        },
        optionValues: {
          include: {
            optionValue: {
              include: { option: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return Promise.all(
      products.map(async (item) => {
        const assessment = await this.getCartProductAssessment(item.id)
        return { ...item, ...assessment }
      })
    )
  }

  async addProduct(cartId: string, dto: AddProductDto) {
    const cartProducts = await this.prismaService.cartProduct.findMany({
      where: {
        cart_id: cartId,
        product_id: dto.id
      },
      include: {
        optionValues: true
      }
    })

    // Найти в корзине товар с такими же опциями
    const cartProduct = cartProducts.find((cartProduct) => {
      if (dto.optionValues && dto.optionValues.length) {
        const identifiers = cartProduct.optionValues.map((item) => item.option_value_id)
        return dto.optionValues.every((id) => identifiers.includes(id))
      }
      return cartProduct.optionValues.length === 0
    })

    // Увеличить количество, если найден, или добавить новый
    if (cartProduct) {
      await this.prismaService.cartProduct.update({
        where: { id: cartProduct.id },
        data: { quantity: cartProduct.quantity + (dto.quantity || 1) },
        include: { optionValues: true }
      })
    } else {
      await this.prismaService.cartProduct.create({
        data: {
          id: v4(),
          quantity: dto.quantity || 1,
          cart: { connect: { id: cartId } },
          product: { connect: { id: dto.id } },
          optionValues: {
            create: (dto.optionValues || []).map((id) => ({ optionValue: { connect: { id } } }))
          }
        }
      })
    }

    return this.findProducts(cartId)
  }

  async updateProduct(cartId: string, cartProductId: string, dto: UpdateProductDto) {
    if (dto.quantity) {
      await this.prismaService.cartProduct.update({
        where: { id: cartProductId },
        data: { quantity: dto.quantity }
      })
    }

    return this.findProducts(cartId)
  }

  async deleteProduct(cartId: string, cartProductId: string) {
    await this.prismaService.cartProduct.delete({
      where: { id: cartProductId }
    })

    return this.findProducts(cartId)
  }

  async getOrderCost(cartId: string, dto?: GetOrderCostDto) {
    const cart = await this.prismaService.cart.findUniqueOrThrow({
      where: { id: cartId },
      include: {
        user: true,
        cartProducts: true
      }
    })

    let quantity = 0
    let cost = 0
    let cartCost = 0
    for (const cartProduct of cart.cartProducts) {
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
        case $Enums.DeliveryService.Shipping:
        case $Enums.DeliveryService.Pickup:
          console.log('deliveryProperties', dto.deliveryProperties?.pickupPointId)
          let inStore = false
          if (dto.deliveryProperties?.pickupPointId) {
            const pickupPoint = await this.pickupPointService.findOne(
              String(dto.deliveryProperties.pickupPointId)
            )
            if (pickupPoint) {
              inStore = pickupPoint.type === $Enums.PickupPointType.store
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
        case $Enums.PaymentService.UponCash:
        case $Enums.PaymentService.Yookassa:
          break
        default:
          throw new Error(`Non-existent payment service: ${dto.deliveryService}`)
      }
    }

    return { cost, composition }
  }

  async createOrder(cartId: string, dto: CreateOrderDto) {
    const cart = await this.prismaService.cart.findUniqueOrThrow({
      where: { id: cartId }
    })

    // получить стоимость заказа
    const orderCost = await this.getOrderCost(cartId, {
      personalDiscount: dto.personalDiscount,
      deliveryService: dto.deliveryService,
      paymentService: dto.paymentService
    })

    // создать заказ
    const order = await this.prismaService.order.create({
      data: {
        hash: v4(),
        cost: orderCost.cost,
        composition: orderCost.composition,
        user: cart.user_id ? { connect: { id: cart.user_id } } : {}
      }
    })

    // создать оплату
    const payment = await this.prismaService.payment.create({
      data: {
        service: dto.paymentService,
        order: { connect: { id: order.id } }
      }
    })

    // создать доставку
    const delivery = await this.prismaService.delivery.create({
      data: {
        service: dto.deliveryService,
        address: dto.deliveryAddress,
        recipient: {
          name: dto.recipientName,
          email: dto.recipientEmail,
          phone: dto.recipientPhone
        },
        order: { connect: { id: order.id } }
      }
    })

    // добавить к заказу товары из корзины
    const cartProducts = await this.prismaService.cartProduct.findMany({
      where: { cart: { id: cartId } },
      include: {
        product: {
          select: {
            id: true,
            title: true
          }
        },
        optionValues: {
          include: {
            optionValue: {
              include: { option: true }
            }
          }
        }
      }
    })
    for (const cartProduct of cartProducts) {
      const productAssessment = await this.getCartProductAssessment(cartProduct.id)

      if (typeof productAssessment.price === 'undefined' || !productAssessment.active) continue

      const options = cartProduct.optionValues.reduce<Record<string, string>>((options, item) => {
        return {
          ...options,
          [item.optionValue.option.caption]: item.optionValue.content
        }
      }, {})

      await this.prismaService.orderProduct.create({
        data: {
          order: { connect: { id: order.id } },
          product: { connect: { id: cartProduct.product.id } },
          options: options,
          quantity: cartProduct.quantity,
          price: productAssessment.price,
          title: cartProduct.product.title
        }
      })
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

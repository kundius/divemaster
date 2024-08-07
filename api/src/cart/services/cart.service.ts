import { EntityRepository, ObjectQuery, wrap } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { CartProduct } from '../entities/cart-product.entity'
import { Cart } from '../entities/cart.entity'
import { User } from '@/users/entities/user.entity'
import { Product } from '@/products/entities/product.entity'
import { ConfigService } from '@nestjs/config'
import { AddProductDto, UpdateProductDto } from '../dto/cart.dto'

@Injectable()
export class CartService {
  constructor(
    private configService: ConfigService,
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

  async calcProduct(cartProduct: CartProduct) {
    const cartProductIds = cartProduct.optionValues.getIdentifiers()
    await cartProduct.product.offers.init({
      populate: ['optionValues']
    })
    const offer = cartProduct.product.offers.find((offer) => {
      const offerIds = offer.optionValues.getIdentifiers()
      if (offerIds.length !== cartProductIds.length) return false
      return offerIds.every((id) => cartProductIds.includes(id))
    })

    // если торговое предложение не найдено, то позиция в корзине считается неактивной
    this.cartProductRepository.assign(cartProduct, {
      active: !!offer
    })

    // если торговое предложение найдено, то считаем стоимость позиции с учетом скидок
    if (offer) {
      // расчет скидок выполнить здесь
      this.cartProductRepository.assign(cartProduct, {
        price: offer.price
      })
    }

    // тут пока так, но с добавлением скидок нужно объеденить в старую цену и скидки и статичное снижение стоимости
    if (offer && cartProduct.product.priceDecrease) {
      this.cartProductRepository.assign(cartProduct, {
        oldPrice: offer.price * (cartProduct.product.priceDecrease / 100) + offer.price
      })
    }
  }

  async findProducts(cartId: string) {
    const products = await this.cartProductRepository.find(
      {
        cart: cartId
      },
      {
        populate: ['product', 'optionValues'],
        orderBy: {
          createdAt: 'DESC'
        }
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

  // generateKey(product: Product, options: Record<string, string>): string {
  //   let key = String(product.id)
  //   if (options) {
  //     key += JSON.stringify(options)
  //   }
  //   return uuidv5(key, this.configService.get('JWT_SECRET_KEY'))
  // }
}

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Wishlist, WishlistType } from '../entities/wishlist.entity'
import { User } from '@/users/entities/user.entity'
import { Product } from '@/products/entities/product.entity'

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async create(type: WishlistType, user?: User) {
    if (user) {
      const userWishlist = await this.wishlistRepository.findOne({
        where: { type, userId: user.id }
      })
      if (userWishlist) {
        return userWishlist
      }
    }

    const wishlist = new Wishlist()
    wishlist.type = type

    if (user) {
      wishlist.user = user
    }

    await this.wishlistRepository.save(wishlist)

    return wishlist
  }

  async authorize(wishlistId: string, user: User) {
    const wishlist = await this.wishlistRepository.findOneOrFail({
      where: { id: wishlistId },
      relations: { user: true }
    })

    if (!wishlist.user) {
      wishlist.user = user
      await this.wishlistRepository.save(wishlist)
    }
  }

  async delete(wishlistId: string) {
    await this.wishlistRepository.delete({ id: wishlistId })
  }

  async findProducts(wishlistId: string) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: { products: true }
    })

    if (wishlist) {
      return wishlist.products
    }

    return []
  }

  async addProduct(wishlistId: string, productId: number) {
    const wishlist = await this.wishlistRepository.findOneOrFail({
      where: { id: wishlistId },
      relations: { products: true }
    })

    const hasProduct = wishlist.products.some((p) => p.id === productId)

    if (!hasProduct) {
      const product = await this.productRepository.findOneByOrFail({ id: productId })
      wishlist.products.push(product)
      await this.wishlistRepository.save(wishlist)
    }

    return this.findProducts(wishlistId)
  }

  async deleteProduct(wishlistId: string, productId: number) {
    const wishlist = await this.wishlistRepository.findOneOrFail({
      where: { id: wishlistId },
      relations: { products: true }
    })

    const pIndex = wishlist.products.findIndex((p) => p.id === productId)

    if (pIndex !== -1) {
      wishlist.products.splice(pIndex, 1)
      await this.wishlistRepository.save(wishlist)
    }

    return this.findProducts(wishlistId)
  }
}

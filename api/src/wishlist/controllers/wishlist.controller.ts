import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { WishlistService } from '../services/wishlist.service'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/entities/user.entity'

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}
  
    @Put(':type')
    async createCart(@CurrentUser() user?: User) {
      return this.wishlistService.createWishlist(user)
    }
  
    @Post(':type/:wishlistId')
    async authorizeCart(@Param('wishlistId') wishlistId: string, @CurrentUser() user?: User) {
      if (!user) {
        throw new BadRequestException()
      }
      return this.wishlistService.authorizeWishlist(wishlistId, user)
    }
  
    @Delete(':type/:wishlistId')
    async deleteCart(@Param('wishlistId') wishlistId: string) {
      return this.wishlistService.deleteWishlist(wishlistId)
    }
  
    @Get(':type/:wishlistId/products')
    async findProducts(@Param('wishlistId') wishlistId: string) {
      return this.wishlistService.findProducts(wishlistId)
    }
  
    @Put(':type/:wishlistId/products')
    async addProduct(@Param('wishlistId') wishlistId: string, @Body() dto: AddProductDto) {
      return this.wishlistService.addProduct(wishlistId, dto)
    }
  
    @Delete(':type/:wishlistId/products/:productId')
    async deleteProduct(@Param('wishlistId') wishlistId: string, @Param('productId') productId: string) {
      return this.wishlistService.deleteProduct(wishlistId, productId)
    }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { WishlistService } from '../services/wishlist.service'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/entities/user.entity'
import { WishlistType } from '../entities/wishlist.entity'

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Put()
  async create(@Body() dto: { type: WishlistType }, @CurrentUser() user?: User) {
    return this.wishlistService.create(dto.type, user)
  }

  @Post(':wishlistId')
  async authorize(@Param('wishlistId') wishlistId: string, @CurrentUser() user?: User) {
    if (!user) {
      throw new BadRequestException()
    }
    return this.wishlistService.authorize(wishlistId, user)
  }

  @Delete(':wishlistId')
  async delete(@Param('wishlistId') wishlistId: string) {
    return this.wishlistService.delete(wishlistId)
  }

  @Get(':wishlistId/products')
  async findProducts(@Param('wishlistId') wishlistId: string) {
    return this.wishlistService.findProducts(wishlistId)
  }

  @Put(':wishlistId/products')
  async addProduct(@Param('wishlistId') wishlistId: string, @Body() dto: { productId: number }) {
    return this.wishlistService.addProduct(wishlistId, dto.productId)
  }

  @Delete(':wishlistId/products')
  async deleteProduct(
    @Param('wishlistId') wishlistId: string,
    @Query() dto: { productId: string }
  ) {
    return this.wishlistService.deleteProduct(wishlistId, +dto.productId)
  }
}

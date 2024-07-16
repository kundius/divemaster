import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { CartService } from '../services/cart.service'
import { User } from '@/users/entities/user.entity'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { AddProductDto, UpdateProductDto } from '../dto/cart.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put()
  async createCart(@CurrentUser() user?: User) {
    return this.cartService.createCart(user)
  }

  @Delete(':cartId')
  async deleteCart(@Param('cartId') cartId: string) {
    return this.cartService.deleteCart(cartId)
  }

  @Get(':cartId/products')
  async findProducts(@Param('cartId') cartId: string) {
    return this.cartService.findProducts(cartId)
  }

  @Put(':cartId/products')
  async addProduct(
    @Param('cartId') cartId: string,
    @Body() dto: AddProductDto,
    @CurrentUser() user?: User
  ) {
    return this.cartService.addProduct(cartId, dto, user)
  }

  @Post(':cartId/products/:productKey')
  async updateProduct(
    @Param('cartId') cartId: string, @Param('productKey') productKey: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user?: User
  ) {
    return this.cartService.updateProduct(cartId, productKey, dto)
  }

  @Delete(':cartId/products/:productKey')
  async deleteProduct(@Param('cartId') cartId: string, @Param('productKey') productKey: string) {
    return this.cartService.deleteProduct(cartId, productKey)
  }
}

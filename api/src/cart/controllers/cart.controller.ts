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
import { CartService } from '../services/cart.service'
import { User } from '@/users/entities/user.entity'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import {
  AddProductDto,
  GetOrderCostDto,
  TemporaryCreateOrderDto,
  UpdateProductDto
} from '../dto/cart.dto'

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put()
  async createCart(@CurrentUser() user?: User) {
    return this.cartService.createCart(user)
  }

  @Post(':cartId')
  async authorizeCart(@Param('cartId') cartId: string, @CurrentUser() user?: User) {
    if (!user) {
      throw new BadRequestException()
    }
    return this.cartService.authorizeCart(cartId, user)
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
  async addProduct(@Param('cartId') cartId: string, @Body() dto: AddProductDto) {
    return this.cartService.addProduct(cartId, dto)
  }

  @Post(':cartId/products/:productId')
  async updateProduct(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.cartService.updateProduct(cartId, productId, dto)
  }

  @Delete(':cartId/products/:productId')
  async deleteProduct(@Param('cartId') cartId: string, @Param('productId') productId: string) {
    return this.cartService.deleteProduct(cartId, productId)
  }

  @Get(':cartId/get-order-cost')
  async getOrderCost(@Param('cartId') cartId: string, @Query() dto?: GetOrderCostDto) {
    return this.cartService.getOrderCost(cartId, dto)
  }

  @Post(':cartId/create-order')
  async createOrder(
    @Param('cartId') cartId: string,
    @Query() dto?: GetOrderCostDto,
    @CurrentUser() user?: User
  ) {
    return this.cartService.createOrder(cartId, dto, user)
  }

  @Put(':cartId')
  async temporaryCreateOrder(
    @Param('cartId') cartId: string,
    @Body() dto: TemporaryCreateOrderDto,
    @CurrentUser() user?: User
  ) {
    return this.cartService.temporaryCreateOrder(cartId, dto, user)
  }
}

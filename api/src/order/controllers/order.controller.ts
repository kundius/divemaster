import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query
} from '@nestjs/common'
import { OrderService } from '../services/order.service'
import { YookassaServiceCheckoutDto } from '../services/yookassa.service'
import { FindAllForUserDto, FindAllOrderQueryDto } from '../dto/order.dto'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { User } from '@/users/entities/user.entity'
import { AuthService } from '@/auth/services/auth.service'
import { VtbServiceCheckoutDto } from '../services/vtb.service'

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService
  ) {}

  @Get()
  findAll(@Query() query: FindAllOrderQueryDto, @CurrentUser() user?: User) {
    if (!this.authService.hasScope(user, 'orders')) {
      throw new ForbiddenException()
    }
    return this.orderService.findAll(query)
  }

  @Get('hash::hash')
  async findOneByHash(@Param('hash') hash: string) {
    const order = await this.orderService.findOneByHash(hash)
    if (!order) {
      throw new NotFoundException()
    }
    return order
  }

  @Get('user')
  async findAllForUser(@Query() dto: FindAllForUserDto, @CurrentUser() user?: User) {
    if (!user) {
      throw new ForbiddenException()
    }
    return this.orderService.findAllForUser(dto, user)
  }

  @Post('checkout/yookassa')
  async checkoutYookassa(@Body() dto: YookassaServiceCheckoutDto) {
    console.log('checkout/yookassa', dto)
    const order = await this.orderService.findOneById(+dto.object.metadata.orderId)
    if (!order || !order.payment) {
      throw new NotFoundException()
    }
    await this.orderService.checkoutPayment(order.payment, dto)
  }

  @Post('checkout/vtb')
  async checkoutVtb(@Body() dto: VtbServiceCheckoutDto) {
    console.log('checkout/vtb', dto)
    const order = await this.orderService.findOneById(+dto.object.orderId)
    if (!order || !order.payment) {
      throw new NotFoundException()
    }
    await this.orderService.checkoutPayment(order.payment, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id)
  }
}

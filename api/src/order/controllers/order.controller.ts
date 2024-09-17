import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common'
import { OrderService } from '../services/order.service'
import { YookassaServiceCheckoutDto } from '../services/yookassa.service'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('hash::hash')
  async findOneByHash(@Param('hash') hash: string) {
    const order = await this.orderService.findOneByHash(hash)
    if (!order) {
      throw new NotFoundException()
    }
    return order
  }

  @Post('checkout/yookassa')
  async checkoutYookassa(@Body() dto: YookassaServiceCheckoutDto) {
    const order = await this.orderService.findOneById(+dto.object.metadata.orderId)
    if (!order) {
      throw new NotFoundException()
    }
    await this.orderService.checkoutPayment(order.payment, dto)
  }
}

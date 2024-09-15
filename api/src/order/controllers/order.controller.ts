import { Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common'
import { OrderService } from '../services/order.service'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('hash::hash')
  async findOneByHash(@Param('hash') hash: string) {
    const order = await this.orderService.findOneByHash(hash)
    if (!order) {
      throw new NotFoundException()
    }

    // Если статус оплаты неизвестен - проверяем через платёжный сервис
    if (order.payment && order.payment.paid === null) {
      await this.orderService.checkPaymentStatus(order.payment)
    }

    return order
  }
}

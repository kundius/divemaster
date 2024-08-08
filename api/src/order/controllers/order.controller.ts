import { Controller } from '@nestjs/common'
import { OrderService } from '../services/order.service'

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}

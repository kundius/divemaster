import { Product } from '@/products/entities/product.entity'
import { EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OrderProduct } from '../entities/order-product.entity'
import { Order } from '../entities/order.entity'

@Injectable()
export class OrderService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: EntityRepository<Order>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: EntityRepository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: EntityRepository<Product>
  ) {}
}

import { Product } from '@/products/entities/product.entity'
import { EntityManager, EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OrderProduct } from '../entities/order-product.entity'
import { Order } from '../entities/order.entity'
import { PickupPoint } from '../entities/pickup-point.entity'
import { UponCashService } from './uponcash.service'
import { YookassaService } from './yookassa.service'
import { PaymentService, PaymentServiceEnum } from '../entities/payment.entity'

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: EntityRepository<Order>,
    @InjectRepository(PickupPoint)
    private pickupPointRepository: EntityRepository<PickupPoint>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: EntityRepository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: EntityRepository<Product>,

    private UponCashService: UponCashService,
    private YookassaService: YookassaService
  ) {}

  getPaymentService(service: PaymentServiceEnum): PaymentService {
    switch (service) {
      case PaymentServiceEnum.UponCash:
        return this.UponCashService
      case PaymentServiceEnum.Yookassa:
        return this.YookassaService
    }
  }
}

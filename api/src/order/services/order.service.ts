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
import { Payment, PaymentService, PaymentServiceEnum } from '../entities/payment.entity'

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: EntityRepository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: EntityRepository<Payment>,
    @InjectRepository(PickupPoint)
    private pickupPointRepository: EntityRepository<PickupPoint>,
    @InjectRepository(OrderProduct)
    private orderProductRepository: EntityRepository<OrderProduct>,
    @InjectRepository(Product)
    private productRepository: EntityRepository<Product>,

    private UponCashService: UponCashService,
    private YookassaService: YookassaService
  ) {}

  // Получение сервиса оплаты
  getPaymentService(payment: Payment): PaymentService {
    switch (payment.service) {
      case PaymentServiceEnum.UponCash:
        return this.UponCashService
      case PaymentServiceEnum.Yookassa:
        return this.YookassaService
    }
  }

  // Проверка статуса оплаты
  async checkPaymentStatus(payment: Payment): Promise<boolean | null> {
    // Работает только при неизвестном статусе
    if (payment.paid === null) {
      const timeout = Number(this.configService.get('PAYMENT_TIMEOUT', '24'))
      // Получаем сервис
      const service = this.getPaymentService(payment)
      // Спрашиваем у него статус
      const status = await service.getPaymentStatus(payment)
      // Это если оплачено
      if (status === true) {
        payment.paid = true
        payment.paidAt = new Date()
        await this.em.persistAndFlush(payment)
      } else if (status === false /* || $this->created_at->addHours($timeout) < Carbon::now()*/) {
        // Это если не оплачено, или просто больше 24 часов с момента заказа
        payment.paid = false
        await this.em.persistAndFlush(payment)
      }
    }

    // И возврат статуса: true, false или null
    return typeof payment.paid === 'boolean' ? payment.paid : null
  }

  async findOneByHash(hash: string): Promise<Order | null> {
    return await this.orderRepository.findOne(
      { hash },
      { populate: ['products', 'payment', 'delivery'] }
    )
  }
}

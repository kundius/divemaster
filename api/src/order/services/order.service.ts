import { EntityManager, EntityRepository, wrap } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { formatPrice, njk } from '@/lib/utils'
import { NotificationsService } from '@/notifications/services/notifications.service'

import { Order } from '../entities/order.entity'
import { Payment, PaymentService, PaymentServiceEnum } from '../entities/payment.entity'
import { UponCashService } from './uponcash.service'
import { YookassaService } from './yookassa.service'

@Injectable()
export class OrderService {
  constructor(
    private readonly entityManager: EntityManager,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
    @InjectRepository(Order)
    private orderRepository: EntityRepository<Order>,

    private paymentUponCashService: UponCashService,
    private paymentYookassaService: YookassaService
  ) {}

  private contextEntityManager: EntityManager | null = null

  getEntityManager() {
    return this.contextEntityManager || this.entityManager
  }

  // Получение сервиса оплаты
  getPaymentService(payment: Payment): PaymentService {
    switch (payment.service) {
      case PaymentServiceEnum.UponCash:
        return this.paymentUponCashService
      case PaymentServiceEnum.Yookassa:
        return this.paymentYookassaService
    }
  }

  async findOneByHash(hash: string): Promise<Order | null> {
    return await this.orderRepository.findOne(
      { hash },
      { populate: ['products', 'payment', 'delivery'] }
    )
  }

  async findOneById(id: number): Promise<Order | null> {
    return await this.orderRepository.findOne(
      { id },
      { populate: ['products', 'payment', 'delivery'] }
    )
  }

  async processPayment(payment: Payment) {
    await wrap(payment).init({ populate: ['order'] })

    const service = this.getPaymentService(payment)
    await service.process(payment)
    await this.getEntityManager().flush()
  }

  async checkoutPayment(payment: Payment, dto: any) {
    await wrap(payment).init({ populate: ['order'] })

    const service = this.getPaymentService(payment)
    await service.checkout(payment, dto)
    await this.getEntityManager().flush()
  }

  async sendEmails(order: Order) {
    const orderEntity = wrap(order)

    await orderEntity.init({
      populate: ['products', 'products.product', 'products.product.images', 'payment', 'delivery']
    })

    const data = orderEntity.serialize({
      populate: ['products', 'products.product', 'products.product.images', 'payment', 'delivery']
    })

    const emailAdmin = this.configService.get('app.emailAdmin')
    if (emailAdmin) {
      await this.notificationsService.sendMail({
        to: emailAdmin,
        subject: `Новый заказ №${order.id} на сайте divermaster.ru`,
        html: njk.render('mails/order-new-admin.njk', { order: data })
      })
    }

    const emailUser = data.delivery.recipient?.['email']
    if (emailUser) {
      await this.notificationsService.sendMail({
        to: emailUser,
        subject: `Вы сделали заказ №${order.id} на сайте divermaster.ru`,
        html: njk.render('mails/order-new-user.njk', { order: data })
      })
    }
  }
}

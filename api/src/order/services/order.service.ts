import { EntityManager, EntityRepository, wrap } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { addHours, compareDesc, subHours } from 'date-fns'
import * as nunjucks from 'nunjucks'

import { NotificationsService } from '@/notifications/services/notifications.service'
import { formatPrice } from '@/lib/utils'

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

  // Проверка статуса оплаты
  async checkPaymentStatus(payment: Payment): Promise<boolean | null> {
    await wrap(payment).init({ populate: ['order'] })

    // Работает только при неизвестном статусе
    if (payment.paid === null) {
      const timeout = this.configService.get('payment.timeout', 24)
      // Получаем сервис
      const service = this.getPaymentService(payment)
      // Спрашиваем у него статус
      const status = await service.getPaymentStatus(payment)
      // Это если оплачено
      if (status === true) {
        payment.paid = true
        payment.paidAt = new Date()
        await this.getEntityManager().persistAndFlush(payment)
      } else if (
        status === false ||
        compareDesc(addHours(payment.createdAt, timeout), new Date())
      ) {
        // Это если не оплачено, или просто больше 24 часов с момента заказа
        payment.paid = false
        await this.getEntityManager().persistAndFlush(payment)
      }
    }

    // И возврат статуса: true, false или null
    return typeof payment.paid === 'boolean' ? payment.paid : null
  }

  async getPaymentLink(payment: Payment) {
    await wrap(payment).init({ populate: ['order'] })

    const service = this.getPaymentService(payment)

    // TODO
    // возможно стоит переместить изменение модели в класс оплаты
    // тогда remoteId тут мешать не будет
    // но не хочется взаимодействовать с базой там, как минимум из-за "context specific actions" в задачах по расписанию
    // но можно изменить payment не сохраняя
    if (payment.link === null) {
      // вот так:
      // await service.makePayment(payment)
      // await this.getEntityManager().flush()
      const makedPayment = await service.makePayment(payment)
      if (makedPayment) {
        payment.link = makedPayment.confirmationUrl
        payment.remoteId = makedPayment.remoteId
        await this.getEntityManager().flush()
      }
    }

    return payment.link
  }

  async findOneByHash(hash: string): Promise<Order | null> {
    return await this.orderRepository.findOne(
      { hash },
      { populate: ['products', 'payment', 'delivery'] }
    )
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkOrderStatus() {
    // Using global EntityManager instance methods for context specific actions is disallowed.
    this.contextEntityManager = this.entityManager.fork()

    const timeout = this.configService.get('payment.timeout', 24)
    const orders = await this.getEntityManager().find(Order, {
      payment: {
        paid: {
          $eq: null
        }
      },
      createdAt: {
        $gt: subHours(new Date(), timeout)
      }
    })

    for (const order of orders) {
      await this.checkPaymentStatus(order.payment)
    }

    await this.getEntityManager().flush()

    this.contextEntityManager = null
  }

  async sendEmails(order: Order) {
    const orderEntity = wrap(order)

    await orderEntity.init({
      populate: ['products', 'products.product', 'products.product.images', 'payment', 'delivery']
    })

    const data = orderEntity.serialize({
      populate: ['products', 'products.product', 'products.product.images', 'payment', 'delivery']
    })

    const njk = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'), {
      autoescape: true
    })

    njk.addFilter('formatPrice', formatPrice)

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

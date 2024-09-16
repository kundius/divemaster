import { EntityManager, EntityRepository, wrap } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { addHours, compareDesc } from 'date-fns'
import * as nunjucks from 'nunjucks'

import { Product } from '@/products/entities/product.entity'

import { OrderProduct } from '../entities/order-product.entity'
import { Order } from '../entities/order.entity'
import { Payment, PaymentService, PaymentServiceEnum } from '../entities/payment.entity'
import { PickupPoint } from '../entities/pickup-point.entity'
import { UponCashService } from './uponcash.service'
import { YookassaService } from './yookassa.service'
import { NotificationsService } from '@/notifications/services/notifications.service'
import { formatPrice } from '@/lib/utils'

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    private notificationsService: NotificationsService,
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
    await wrap(payment).init({ populate: ['order'] })

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
      } else if (
        status === false ||
        compareDesc(addHours(payment.createdAt, timeout), new Date())
      ) {
        // Это если не оплачено, или просто больше 24 часов с момента заказа
        payment.paid = false
        await this.em.persistAndFlush(payment)
      }
    }

    // И возврат статуса: true, false или null
    return typeof payment.paid === 'boolean' ? payment.paid : null
  }

  async getPaymentLink(payment: Payment) {
    await wrap(payment).init({ populate: ['order'] })

    const service = this.getPaymentService(payment)

    if (payment.link === null) {
      const link = await service.makePayment(payment)
      if (link) {
        payment.link = link
        await this.em.flush()
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
    // TODO
    // собрать неоплаченные заказы за последние сутки
    // проверить статус
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
      // $mail = new Mail();
      // $subject = getenv('EMAIL_SUBJECT_ORDER_NEW_ADMIN_' . strtoupper($lang));
      // if ($error = $mail->send($emailAdmin, $subject, 'email-order-new-admin', $data)) {
      //     return $error;
      // }
      await this.notificationsService.sendMail({
        to: emailAdmin,
        subject: `Новый заказ №${order.id} на сайте divermaster.ru`,
        html: njk.render('mails/order-new-admin.njk', { order: data })
      })
    }

    // $subject = getenv('EMAIL_SUBJECT_ORDER_NEW_USER_' . strtoupper($lang));
    // if ($error = $this->user->sendEmail($subject, 'email-order-new-user', $data)) {
    //     return $error;
    // }
  }
}

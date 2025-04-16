import { njk } from '@/lib/utils'
import { NotificationsService } from '@/notifications/services/notifications.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaymentService } from './payment.service'
import { UponCashService } from './uponcash.service'
import { YookassaService } from './yookassa.service'
import { Payment, PaymentServiceEnum } from '../entities/payment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from '../entities/order.entity'
import { Repository } from 'typeorm'
import { FindAllForUserDto, FindAllOrderQueryDto } from '../dto/order.dto'
import { User } from '@/users/entities/user.entity'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private notificationsService: NotificationsService,
    private configService: ConfigService,
    private paymentUponCashService: UponCashService,
    private paymentYookassaService: YookassaService
  ) {}

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
    return this.orderRepository.findOne({
      where: { hash },
      relations: {
        products: true,
        payment: true,
        delivery: true
      }
    })
  }

  async findOneById(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: {
        products: true,
        payment: true,
        delivery: true
      }
    })
  }

  async findAll(dto: FindAllOrderQueryDto) {
    const qb = this.orderRepository.createQueryBuilder('order')

    qb.leftJoinAndSelect('order.payment', 'payment')
    qb.leftJoinAndSelect('order.delivery', 'delivery')
    qb.leftJoinAndSelect('order.user', 'user')
    qb.leftJoinAndSelect('order.products', 'products')

    qb.orderBy(`order.${dto.sort}`, dto.dir)
    qb.skip(dto.skip)
    qb.take(dto.take)

    let [rows, total] = await qb.getManyAndCount()

    if (dto.query) {
      const query = dto.query
      rows = rows.filter((row) => (row.number ? row.number.includes(query) : false))
    }

    return { rows, total }
  }

  async findAllForUser(dto: FindAllForUserDto, user: User) {
    const qb = this.orderRepository.createQueryBuilder('order')

    qb.leftJoinAndSelect('order.payment', 'payment')
    qb.leftJoinAndSelect('order.delivery', 'delivery')
    qb.leftJoinAndSelect('order.user', 'user')
    qb.where('user.id = :userId', { userId: user.id })
    qb.orderBy(`order.${dto.sort}`, dto.dir)
    qb.skip(dto.skip)
    qb.take(dto.take)

    const [rows, total] = await qb.getManyAndCount()

    return { rows, total }
  }

  async remove(id: number) {
    return this.orderRepository.delete({ id })
  }

  async processPayment(payment: Payment) {
    const service = this.getPaymentService(payment)
    await service.process(payment)
  }

  async checkoutPayment(payment: Payment, dto: any) {
    const service = this.getPaymentService(payment)
    await service.checkout(payment, dto)
  }

  async sendEmails(order: Order) {
    const data = await this.orderRepository.findOneOrFail({
      where: { id: order.id },
      relations: {
        payment: true,
        delivery: true,
        products: { product: { images: true } }
      }
    })

    const emailAdmin = this.configService.get('app.emailAdmin')
    if (emailAdmin) {
      await this.notificationsService.sendMail({
        to: emailAdmin,
        subject: `Новый заказ №${order.id} на сайте divermaster.ru`,
        html: njk.render('mails/order-new-admin.njk', { order: data })
      })
    }

    const emailUser = data.delivery?.recipient?.['email']
    if (emailUser) {
      await this.notificationsService.sendMail({
        to: emailUser,
        subject: `Вы сделали заказ №${order.id} на сайте divermaster.ru`,
        html: njk.render('mails/order-new-user.njk', { order: data })
      })
    }
  }
}

import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaymentService } from './payment.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../entities/order.entity'
import { Payment } from '../entities/payment.entity'

export interface YookassaServiceCheckoutDto {
  type: string
  event: string
  object: {
    id: string
    status: string
    paid: boolean
    amount: {
      value: string
      currency: string
    }
    metadata: Record<string, string>
    refundable: boolean
    test: boolean
  }
}

@Injectable()
export class YookassaService implements PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService
  ) {}

  getAuthorizationHeader() {
    const arr = [
      this.configService.get('yookassa.user'),
      this.configService.get('yookassa.password')
    ]
    const auth = btoa(arr.join(':'))
    return `Basic ${auth}`
  }

  async process(payment: Payment) {
    const order = await this.orderRepository.findOneOrFail({
      where: {
        payment: { id: payment.id }
      }
    })
    const returnUrl = await this.getSuccessUrl(payment)

    const params = {
      // Стоимость заказа
      amount: {
        value: order.cost,
        currency: 'RUB'
      },
      // Тип подтверждения от юзера вместе с url возврата
      confirmation: {
        type: 'redirect',
        return_url: returnUrl
      },
      // Оплата в один этап
      capture: true,
      // Описание и метаданные на всякий случай
      // description: payment.order.cost,
      metadata: {
        paymentId: payment.id,
        orderId: order.id
      }
    }

    const response = await fetch(`${this.configService.get('yookassa.endpoint')}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': order.hash,
        Authorization: this.getAuthorizationHeader()
      },
      body: JSON.stringify(params)
    })

    const data = await response.json()

    await this.paymentRepository.update(
      { id: payment.id },
      {
        link: data.confirmation.confirmation_url,
        remoteId: data.id
      }
    )
  }

  async checkout(payment: Payment, dto: YookassaServiceCheckoutDto) {
    const status = await this.getStatus(payment)

    if (dto.object.status !== status) {
      throw new BadRequestException('Status failed verification')
    }

    if (dto.object.status === 'succeeded') {
      await this.paymentRepository.update(
        { id: payment.id },
        {
          paid: true,
          paidAt: new Date()
        }
      )
    }

    if (dto.object.status === 'canceled') {
      await this.paymentRepository.update(
        { id: payment.id },
        {
          paid: false,
          paidAt: new Date()
        }
      )
    }
  }

  async getSuccessUrl(payment: Payment) {
    const order = await this.orderRepository.findOneOrFail({
      where: {
        payment: { id: payment.id }
      }
    })

    return `${this.configService.get('app.url.frontend')}/order/details/${order.hash}`
  }

  async getStatus(payment: Payment): Promise<string | null> {
    if (!payment.remoteId) {
      return null
    }

    const order = await this.orderRepository.findOneOrFail({
      where: {
        payment: { id: payment.id }
      }
    })

    try {
      const response = await fetch(
        `${this.configService.get('yookassa.endpoint')}/payments/${payment.remoteId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Idempotence-Key': order.hash,
            Authorization: this.getAuthorizationHeader()
          }
        }
      )

      const data = await response.json()

      return data.status
    } catch {}

    return null
  }
}

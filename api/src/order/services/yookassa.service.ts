import { BadRequestException, Injectable } from '@nestjs/common'
import { Payment, PaymentService } from '../entities/payment.entity'
import { ConfigService } from '@nestjs/config'

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
  constructor(private readonly configService: ConfigService) {}

  getAuthorizationHeader() {
    const arr = [
      this.configService.get('yookassa.user'),
      this.configService.get('yookassa.password')
    ]
    const auth = btoa(arr.join(':'))
    return `Basic ${auth}`
  }

  async process(payment: Payment) {
    const returnUrl = await this.getSuccessUrl(payment)

    const params = {
      // Стоимость заказа
      amount: {
        value: payment.order.cost,
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
        orderId: payment.order.id
      }
    }

    const response = await fetch(`${this.configService.get('yookassa.endpoint')}payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': payment.order.hash,
        Authorization: this.getAuthorizationHeader()
      },
      body: JSON.stringify(params)
    })

    const data = await response.json()

    payment.link = data.confirmation.confirmation_url
    payment.remoteId = data.id
  }

  async checkout(payment: Payment, dto: YookassaServiceCheckoutDto) {
    const status = await this.getStatus(payment)

    if (dto.object.status !== status) {
      throw new BadRequestException('Status failed verification')
    }

    if (dto.object.status === 'succeeded') {
      payment.paid = true
      payment.paidAt = new Date()
    }

    if (dto.object.status === 'canceled') {
      payment.paid = false
      payment.paidAt = new Date()
    }
  }

  async getSuccessUrl(payment: Payment) {
    return `${this.configService.get('app.url')}/order/details/${payment.order.hash}`
  }

  async getStatus(payment: Payment): Promise<string | null> {
    if (!payment.remoteId) {
      return null
    }

    try {
      const response = await fetch(
        `${this.configService.get('yookassa.endpoint')}payments/${payment.remoteId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Idempotence-Key': payment.order.hash,
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

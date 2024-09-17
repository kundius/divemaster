import { Injectable } from '@nestjs/common'
import { Payment, PaymentService, PaymentServiceMakedPayment } from '../entities/payment.entity'
import { ConfigService } from '@nestjs/config'

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

  async makePayment(payment: Payment): Promise<PaymentServiceMakedPayment | null> {
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
      description: payment.order.cost,
      metadata: {
        payment_id: payment.id,
        order_id: payment.order.id
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

    return {
      confirmationUrl: data.confirmation.confirmation_url,
      remoteId: data.id
    }
  }

  async getPaymentStatus(payment: Payment) {
    console.log('getPaymentStatus')
    
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

      console.log(data, response)

      if (data.status === 'succeeded') {
        return true
      }

      if (data.status === 'canceled') {
        return false
      }
    } catch {
      // Исключения игнорируем, потому что проверок может быть много, а ошибки нас не интересуют
      // По истечению таймаута в 24 часа платежу будет выставлен статус false в любом случае
    }

    return null
  }

  async getSuccessUrl(payment: Payment) {
    return `${this.configService.get('app.url')}/order/details/${payment.order.hash}`
  }
}

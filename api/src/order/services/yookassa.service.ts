import { Injectable } from '@nestjs/common'
import { EntityManager, wrap } from '@mikro-orm/mariadb'
import { Payment, PaymentService } from '../entities/payment.entity'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class YookassaService implements PaymentService {
  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService
  ) {}

  getAuthorizationHeader() {
    const arr = [
      this.configService.get('PAYMENT_YOOKASSA_USER'),
      this.configService.get('PAYMENT_YOOKASSA_PASSWORD')
    ]
    const auth = btoa(arr.join(':'))
    return `Basic ${auth}`
  }

  async makePayment(payment: Payment): Promise<string> {
    await wrap(payment).init({ populate: ['order'] })

    const returnUrl = await this.getSuccessUrl(payment)

    const response = await fetch(`${this.configService.get('PAYMENT_YOOKASSA_ENDPOINT')}payments`, {
      method: 'POST',
      headers: {
        'Idempotence-Key': payment.order.hash,
        Authorization: this.getAuthorizationHeader()
      },
      body: JSON.stringify({
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
      })
    })
    console.log(response)

    return 'YookassaService makePayment'
  }

  async getPaymentStatus(payment: Payment): Promise<boolean | null> {
    await wrap(payment).init({ populate: ['order'] })

    const returnUrl = await this.getSuccessUrl(payment)

    const response = await fetch(
      `${this.configService.get('PAYMENT_YOOKASSA_ENDPOINT')}payments/${payment.remoteId}`,
      {
        method: 'GET',
        headers: {
          'Idempotence-Key': payment.order.hash,
          Authorization: this.getAuthorizationHeader()
        }
      }
    )
    console.log(response)

    return null
  }

  async getSuccessUrl(payment: Payment): Promise<string> {
    await wrap(payment).init({ populate: ['order'] })

    return `${this.configService.get('APP_ORIGIN')}/order/details/${payment.order.hash}`
  }
}

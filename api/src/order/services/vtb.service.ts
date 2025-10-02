import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaymentService } from './payment.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Order } from '../entities/order.entity'
import { Payment } from '../entities/payment.entity'

export interface VtbServiceCheckoutDto {
  type: 'PAYMENT'
  object: {
    paymentId: string
    paymentCode: string
    orderId: string
    orderCode: string
    createdAt: string
    description?: string
    amount: {
      value: number
      code: string
    }
    paymentData: {
      type: 'sbp' | 'card'
    }
    status: {
      changedAt: string
      value: string
      description?: string
    }
  }
}
// PROD_TOKEN=https://open.api.vtb.ru:443/passport/oauth2/token
// PROD_ORDER=https://gw.api.vtb.ru/openapi/smb/efcp/e-commerce/v1/orders
// PROD_ORDER_PREAUTH=https://gw.api.vtb.ru/openapi/smb/efcp/e-commerce/v1/orders/preauth
// PROD_REFUND=https://gw.api.vtb.ru/openapi/smb/efcp/e-commerce/v1/refunds

// TEST_TOKEN=https://auth.bankingapi.ru/auth/realms/kubernetes/protocol/openid-connect/token
// TEST_ORDER=https://hackaton.bankingapi.ru/api/smb/efcp/e-commerce/api/v1/orders
// TEST_ORDER_PREAUTH=https://hackaton.bankingapi.ru/api/smb/efcp/e-commerce/api/v1/orders/preauth
// TEST_REFUND=https://hackaton.bankingapi.ru/api/smb/efcp/e-commerce/api/v1/refunds

@Injectable()
export class VtbService implements PaymentService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly configService: ConfigService
  ) {}

  async getAuthorizationHeader() {
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', String(this.configService.get('vtb.client_id')))
    params.append('client_secret', String(this.configService.get('vtb.client_secret')))
    console.log(
      '[ВТБ] Получить токен',
      String(this.configService.get('vtb.token_endpoint')),
      params.toString()
    )
    const response = await fetch(String(this.configService.get('vtb.token_endpoint')), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
    const data = await response.json()
    console.log('[ВТБ] Токен получен', data)
    return {
      'X-IBM-Client-Id': this.configService.get('vtb.client_id'),
      Authorization: `${data.token_type} ${data.access_token}`
    }
  }

  async process(payment: Payment) {
    const order = await this.orderRepository.findOneOrFail({
      where: {
        payment: { id: payment.id }
      }
    })
    const returnUrl = await this.getSuccessUrl(payment)

    const params = {
      orderId: order.id,
      orderName: `Заказ №${order.number}`,
      amount: {
        value: order.cost,
        code: 'RUB'
      },
      returnUrl: returnUrl
    }

    const response = await fetch(`${this.configService.get('vtb.api_endpoint')}orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await this.getAuthorizationHeader())
      },
      body: JSON.stringify(params)
    })

    const data = await response.json()

    console.log('[ВТБ] Заказ создан', data)

    await this.paymentRepository.update(
      { id: payment.id },
      {
        link: data.object.payUrl,
        remoteId: data.object.orderCode
      }
    )
  }

  async checkout(payment: Payment, dto: VtbServiceCheckoutDto) {
    // const status = await this.getStatus(payment)

    console.log('[ВТБ] Получен колбек', dto.object)

    if (dto.object.orderCode !== payment.remoteId) {
      throw new BadRequestException('Status failed verification')
    }

    if (dto.object.status.value === 'CONFIRMED') {
      await this.paymentRepository.update(
        { id: payment.id },
        {
          paid: true,
          paidAt: new Date()
        }
      )
    }

    if (dto.object.status.value === 'DECLINED') {
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

    return `${this.configService.get('app.url')}/order/details/${order.hash}`
  }

  // async getStatus(payment: Payment): Promise<string | null> {
  //   if (!payment.remoteId) {
  //     return null
  //   }

  //   const order = await this.orderRepository.findOneOrFail({
  //     where: {
  //       payment: { id: payment.id }
  //     }
  //   })

  //   try {
  //     const response = await fetch(
  //       `${this.configService.get('vtb.api_endpoint')}v1/orders/${payment.orderId}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Idempotence-Key': order.hash,
  //           Authorization: this.getAuthorizationHeader()
  //         }
  //       }
  //     )

  //     const data = await response.json()

  //     return data.object.status.value
  //   } catch {}

  //   return null
  // }
}

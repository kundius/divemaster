import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Repository } from 'typeorm'
import { Agent, request } from 'undici'
import { Order } from '../entities/order.entity'
import { Payment } from '../entities/payment.entity'
import { PaymentService } from './payment.service'

const certDir = join(__dirname, '..', '..', '..', '..', 'certs')

const ca = [
  readFileSync(join(certDir, 'rootca_ssl_rsa2022.crt')),
  readFileSync(join(certDir, 'subca_ssl_rsa2022.crt')),
  readFileSync(join(certDir, 'subca_ssl_rsa2024.crt'))
]

const dispatcher = new Agent({
  connect: { ca }
})

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
    console.log('[ВТБ] Запрашиваем токен')

    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('client_id', String(this.configService.get('vtb.client_id')))
    params.append('client_secret', String(this.configService.get('vtb.client_secret')))

    try {
      const { body } = await request(String(this.configService.get('vtb.token_endpoint')), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString(),
        dispatcher
      })

      // TODO: создать отдельный тип
      const data = (await body.json()) as {
        token_type: string
        access_token: string
      }

      return {
        'X-IBM-Client-Id': this.configService.get('vtb.client_id'),
        Authorization: `${data.token_type} ${data.access_token}`
      }
    } catch (e) {
      console.log('[ВТБ] Ошибка запроса токена', e)
      throw e
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
      orderId: String(order.id),
      orderName: `Заказ №${order.number}`,
      amount: {
        value: order.cost,
        code: 'RUB'
      },
      returnUrl: returnUrl
    }

    try {
      const authHeader = await this.getAuthorizationHeader()
      const { body: responseBody } = await request(
        `${this.configService.get('vtb.api_endpoint')}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify(params),
          dispatcher
        }
      )

      // TODO: создать отдельный тип
      const data = (await responseBody.json()) as {
        object: {
          payUrl: string
          orderCode: string
        }
      }

      console.log('[ВТБ] Заказ создан', data)

      await this.paymentRepository.update(
        { id: payment.id },
        {
          link: data.object.payUrl,
          remoteId: data.object.orderCode
        }
      )
    } catch (e) {
      console.log('[ВТБ] Ошибка создания заказа', e)
      throw e
    }
  }

  async checkout(payment: Payment, dto: VtbServiceCheckoutDto) {
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

    return `${this.configService.get('app.url.frontend')}/order/details/${order.hash}`
  }
}

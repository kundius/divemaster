import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/mariadb'
import { Payment, PaymentService } from '../entities/payment.entity'

@Injectable()
export class UponCashService implements PaymentService {
  constructor(readonly em: EntityManager) {}

  async makePayment(payment: Payment): Promise<string> {
    throw new Error()
  }

  async getPaymentStatus(payment: Payment): Promise<boolean> {
    throw new Error()
  }

  async getSuccessUrl(payment: Payment): Promise<string> {
    throw new Error()
  }
}

import { EntityManager } from '@mikro-orm/mariadb'
import { Injectable } from '@nestjs/common'

import { Payment, PaymentService } from '../entities/payment.entity'

@Injectable()
export class UponCashService implements PaymentService {
  constructor(readonly em: EntityManager) {}

  async makePayment(payment: Payment): Promise<string | null> {
    return null
  }

  async getPaymentStatus(payment: Payment): Promise<boolean> {
    return false
  }

  async getSuccessUrl(payment: Payment): Promise<string | null> {
    return null
  }
}

import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/mariadb'
import { Payment, PaymentService } from '../entities/payment.entity'

@Injectable()
export class YookassaService implements PaymentService {
  constructor(readonly em: EntityManager) {}

  async makePayment(payment: Payment): Promise<string> {
    return 'YookassaService makePayment'
  }

  async getPaymentStatus(payment: Payment): Promise<boolean> {
    return false
  }

  async getSuccessUrl(payment: Payment): Promise<string> {
    return 'getSuccessUrl'
  }
}

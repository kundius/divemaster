import { Injectable } from '@nestjs/common'

import { PaymentService } from '../entities/payment.entity'

@Injectable()
export class UponCashService implements PaymentService {
  constructor() {}

  async makePayment() {
    return null
  }

  async getPaymentStatus() {
    return false
  }

  async getSuccessUrl() {
    return null
  }
}

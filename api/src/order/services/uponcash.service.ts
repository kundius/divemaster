import { Injectable } from '@nestjs/common'
import { PaymentService } from './payment.service'

@Injectable()
export class UponCashService implements PaymentService {
  constructor() {}

  async process() {}

  async checkout() {}

  async getSuccessUrl() {
    return null
  }
}

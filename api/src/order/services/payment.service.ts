import { Payment } from '../entities/payment.entity'

export interface PaymentService {
  process(payment: Payment): Promise<void>
  checkout(payment: Payment, dto: any): Promise<void>
  getSuccessUrl(payment: Payment): Promise<string | null>
}

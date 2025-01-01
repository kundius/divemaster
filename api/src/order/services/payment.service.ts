import { Payment } from '@prisma/client'

export interface PaymentService {
  process(payment: Payment): Promise<void>
  checkout(payment: Payment, dto: any): Promise<void>
  getSuccessUrl(payment: Payment): Promise<string | null>
}

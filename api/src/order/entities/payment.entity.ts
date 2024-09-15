import { Entity, Enum, OneToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core'

import { Order } from './order.entity'

export enum PaymentServiceEnum {
  Yookassa = 'Yookassa',
  UponCash = 'UponCash'
}

export interface PaymentService {
  makePayment(payment: Payment): Promise<string | null>
  getPaymentStatus(payment: Payment): Promise<boolean | null>
  getSuccessUrl(payment: Payment): Promise<string | null>
}

@Entity()
export class Payment {
  @PrimaryKey()
  id!: number

  @Enum(() => PaymentServiceEnum)
  service!: PaymentServiceEnum

  @Property({ type: 'tinyint', nullable: true, serializer: Boolean })
  paid: boolean | null = null

  @Property({ type: 'varchar', default: null, nullable: true })
  link: string | null = null

  @Property({ type: 'varchar', default: null, nullable: true })
  remoteId: string | null = null

  @OneToOne(() => Order, (order) => order.payment, { owner: true })
  order!: Order

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  paidAt: Date & Opt = new Date()
}

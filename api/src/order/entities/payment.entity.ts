import { Entity, Enum, OneToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core'

import { Order } from './order.entity'

export enum PaymentServiceEnum {
  Yookassa = 'Yookassa',
  UponCash = 'UponCash'
}

export interface PaymentService {
  process(payment: Payment): Promise<void>
  checkout(payment: Payment, dto: any): Promise<void>
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

  @Property({ type: 'datetime', nullable: true, default: null })
  paidAt: Date | null = null
}

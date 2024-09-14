import { Entity, Enum, ManyToOne, OneToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core'

import { Order } from './order.entity'
import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/mariadb'

export enum PaymentServiceEnum {
  Yookassa = 'Yookassa',
  UponCash = 'UponCash'
}

export interface PaymentService {
  makePayment(payment: Payment): Promise<string | null>
  getPaymentStatus(payment: Payment): Promise<boolean>
  getSuccessUrl(payment: Payment): Promise<string | null>
}

@Entity()
export class Payment {
  @PrimaryKey()
  id!: number

  @Enum(() => PaymentServiceEnum)
  service!: PaymentServiceEnum

  @Property({ default: false })
  paid: boolean = false

  @Property({ type: 'varchar', nullable: true })
  link: string | null = null

  @OneToOne(() => Order, (order) => order.payment, { owner: true })
  order!: Order

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  paidAt: Date & Opt = new Date()
}

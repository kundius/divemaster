import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
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
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'enum',
    enum: PaymentServiceEnum
  })
  service!: PaymentServiceEnum

  @Column({
    type: 'tinyint',
    nullable: true
  })
  paid: boolean | null

  @Column({ type: 'varchar', default: null, nullable: true })
  link: string | null

  @Column({ type: 'varchar', default: null, nullable: true })
  remoteId: string | null

  @Column()
  orderId: number

  @OneToOne(() => Order, (order) => order.payment)
  @JoinColumn()
  order!: Order

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'datetime', nullable: true, default: null })
  paidAt: Date | null
}

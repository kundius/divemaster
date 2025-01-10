import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Order } from './order.entity'

export enum DeliveryService {
  Pickup = 'Pickup',
  Shipping = 'Shipping'
}

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    type: 'enum',
    enum: DeliveryService
  })
  service!: DeliveryService

  @Column({ type: 'tinyint', nullable: true })
  delivered: boolean | null = null

  @Column()
  address!: string

  @Column({ type: 'simple-json', nullable: true })
  recipient: Record<string, string> | null

  @Column()
  orderId: number

  @OneToOne(() => Order, (order) => order.delivery)
  @JoinColumn()
  order!: Order

  @CreateDateColumn()
  createdAt: Date

  @Column({ type: 'datetime', nullable: true, default: null })
  deliveredAt: Date | null
}

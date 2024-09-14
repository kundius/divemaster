import { Entity, Enum, ManyToOne, OneToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core'

import { Order } from './order.entity'

export enum DeliveryService {
  Pickup = 'Pickup',
  Shipping = 'Shipping'
}

@Entity()
export class Delivery {
  @PrimaryKey()
  id!: number

  @Enum(() => DeliveryService)
  service!: DeliveryService

  @Property({ default: false })
  delivered: boolean = false

  @Property()
  address!: string

  @Property({ type: 'json', nullable: true })
  recipient?: Record<string, string>

  @OneToOne(() => Order, (order) => order.delivery, { owner: true })
  order!: Order

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  deliveredAt: Date & Opt = new Date()
}

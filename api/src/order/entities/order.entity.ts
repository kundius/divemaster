import { User } from '@/users/entities/user.entity'
import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { v4 } from 'uuid'
import { OrderProduct } from './order-product.entity'

export enum DeliveryMethod {
  SHIPPING = 'SHIPPING',
  PICKUP = 'PICKUP'
}

export enum PaymentMethod {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE'
}

export enum OrderStatus {
  CREATED = 'CREATED'
  // OFFLINE = 'OFFLINE'
}

@Entity()
export class Order {
  @PrimaryKey()
  id!: number

  @Property()
  uuid = v4()

  @Property({ unsigned: true })
  cost!: number

  @Enum(() => DeliveryMethod)
  status!: DeliveryMethod

  @Enum(() => DeliveryMethod)
  delivery!: DeliveryMethod

  @Enum(() => PaymentMethod)
  payment!: PaymentMethod

  @Property({ type: 'json', nullable: true })
  recipient?: Record<string, string>

  @ManyToOne(() => User, { nullable: true, deleteRule: 'set null' })
  user: User | null = null

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products = new Collection<OrderProduct>(this)

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()
}

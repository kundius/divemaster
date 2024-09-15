import { User } from '@/users/entities/user.entity'
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Delivery } from './delivery.entity'
import { OrderProduct } from './order-product.entity'
import { Payment } from './payment.entity'

@Entity()
export class Order {
  @PrimaryKey()
  id!: number

  @Property({ unique: true })
  hash!: string

  @Property({ unsigned: true })
  cost!: number

  @Property({ unsigned: true })
  amount!: number

  @Property({ type: 'json', nullable: true })
  composition?: Array<{ name: string; value: number }>

  @ManyToOne(() => User, { nullable: true, deleteRule: 'set null' })
  user: User | null = null

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products = new Collection<OrderProduct>(this)

  @OneToOne(() => Payment, (payment) => payment.order, { orphanRemoval: true })
  payment!: Payment

  @OneToOne(() => Delivery, (delivery) => delivery.order, { orphanRemoval: true })
  delivery!: Delivery

  @Property()
  createdAt: Date & Opt = new Date()
}

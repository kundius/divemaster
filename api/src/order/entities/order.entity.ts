import { User } from '@/users/entities/user.entity'
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { v4 } from 'uuid'
import { OrderProduct } from './order-product.entity'

@Entity()
export class Order {
  @PrimaryKey()
  id: number

  @Property({ unsigned: true })
  cost!: number

  @Property({ type: 'varchar', nullable: true })
  customerPhone: string | null = null

  @Property({ type: 'varchar', nullable: true })
  customerEmail: string | null = null

  @Property({ type: 'varchar', nullable: true })
  customerName: string | null = null

  @ManyToOne(() => User, { nullable: true, deleteRule: 'set null' })
  user: User | null = null

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products = new Collection<OrderProduct>(this)

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()
}

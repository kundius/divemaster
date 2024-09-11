import { Product } from '@/products/entities/product.entity'
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'

import { Order } from './order.entity'

@Entity()
export class OrderProduct {
  @PrimaryKey()
  id: number

  @ManyToOne(() => Order, { deleteRule: 'cascade' })
  order!: Order

  @ManyToOne(() => Product, { nullable: true, deleteRule: 'set null' })
  product: Product | null = null

  @Property({ unsigned: true })
  amount!: number

  @Property({ unsigned: true })
  price!: number

  @Property()
  title!: string

  @Property({ type: 'json', nullable: true })
  options?: Record<string, string>
}

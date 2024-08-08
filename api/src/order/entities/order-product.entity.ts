import { OptionValue } from '@/products/entities/option-value.entity'
import { Product } from '@/products/entities/product.entity'
import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'
import { Order } from './order.entity'

@Entity()
export class OrderProduct {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @ManyToOne(() => Order, { deleteRule: 'cascade' })
  order!: Order

  @ManyToOne(() => Product, { deleteRule: 'cascade' })
  product!: Product

  @Property({ unsigned: true })
  amount!: number

  @Property({ unsigned: true })
  price!: number

  @ManyToMany(() => OptionValue)
  optionValues = new Collection<OptionValue>(this)
}

import { Product } from '@/products/entities/product.entity'
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Opt,
  PrimaryKey,
  PrimaryKeyProp,
  Property
} from '@mikro-orm/core'
import { Cart } from './cart.entity'
import { v4 } from 'uuid'
import { OptionValue } from '@/products/entities/option-value.entity'

@Entity()
export class CartProduct {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @ManyToOne(() => Cart, { deleteRule: 'cascade', primary: true })
  cart!: Cart

  @ManyToOne(() => Product, { deleteRule: 'cascade' })
  product!: Product

  @Property({ default: 1, unsigned: true })
  amount: number = 1

  @ManyToMany(() => OptionValue)
  optionValues = new Collection<OptionValue>(this)

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()
}

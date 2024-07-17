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
import { CartProduct } from './cart-product.entity'
import { v4 } from 'uuid'

@Entity()
export class Cart {
  @PrimaryKey({ type: 'uuid' })
  uuid = v4()

  @OneToOne(() => User, { nullable: true, deleteRule: 'set null' })
  user: User | null = null

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  products = new Collection<CartProduct>(this)

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()
}

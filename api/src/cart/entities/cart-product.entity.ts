import { Product } from '@/products/entities/product.entity'
import { Entity, ManyToOne, Opt, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core'
import { Cart } from './cart.entity'

@Entity()
export class CartProduct {
  constructor(cart: Cart, productKey: string) {
    this.cart = cart
    this.productKey = productKey
  }

  [PrimaryKeyProp]?: ['cart', 'productKey']

  @ManyToOne(() => Cart, { deleteRule: 'cascade', primary: true })
  cart!: Cart

  @ManyToOne(() => Product, { deleteRule: 'cascade' })
  product!: Product

  @PrimaryKey()
  @Property()
  productKey: string

  @Property({ default: 1, unsigned: true })
  amount: number = 1

  @Property({ type: 'json', nullable: true })
  options: Record<string, string> | null = null

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()
}

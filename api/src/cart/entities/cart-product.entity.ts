import { Product } from '@/products/entities/product.entity'
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Cart } from './cart.entity'
import { v4 } from 'uuid'
import { OptionValue } from '@/products/entities/option-value.entity'

/**
 * Товар в корзине может стать неактивным, если оригинальный товар был удален.
 * Цена может быть не заполена, если у товара нет торговых предложений.
 */
@Entity()
export class CartProduct {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @ManyToOne(() => Cart, { deleteRule: 'cascade' })
  cart!: Cart

  @ManyToOne(() => Product, { deleteRule: 'cascade' })
  product!: Product

  @Property({ default: 1, unsigned: true })
  quantity: number = 1

  @ManyToMany(() => OptionValue)
  optionValues = new Collection<OptionValue>(this)

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()

  @Property({ persist: false })
  oldPrice?: number

  @Property({ persist: false })
  price?: number

  @Property({ persist: false })
  active?: boolean
}

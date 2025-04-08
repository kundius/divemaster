import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 } from 'uuid'
import { Cart } from './cart.entity'
import { Product } from '@/products/entities/product.entity'
import { OptionValue } from '@/products/entities/option-value.entity'
import { CartProductOption } from './cart-product-option.entity'

/**
 * Товар в корзине может стать неактивным, если оригинальный товар был удален.
 * Цена может быть не заполена, если у товара нет торговых предложений.
 */
@Entity()
export class CartProduct {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  id = v4()

  @Column({ type: 'uuid', length: 36 })
  cartId: string

  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  cart!: Cart

  @Column()
  productId: number

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product!: Product

  @Column({ default: 1, unsigned: true })
  quantity: number = 1

  // TODO remove
  @ManyToMany(() => OptionValue)
  @JoinTable({ name: 'cart_product_option_values' })
  optionValues: OptionValue[]

  @OneToMany(() => CartProductOption, (option) => option.cartProduct)
  options: CartProductOption[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  oldPrice?: number

  price?: number

  active?: boolean
}

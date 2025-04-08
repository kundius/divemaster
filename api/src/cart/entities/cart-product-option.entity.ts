import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { CartProduct } from './cart-product.entity'

@Entity()
export class CartProductOption {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  cartProductId: number

  @ManyToOne(() => CartProduct, (cartProduct) => cartProduct.options, { onDelete: 'CASCADE' })
  cartProduct: CartProduct

  @Column()
  name!: string

  @Column()
  content!: string
}

import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { v4 } from 'uuid'
import { CartProduct } from './cart-product.entity'

@Entity()
export class Cart {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  id = v4()

  @Column({ type: 'int', nullable: true })
  userId: number | null

  @OneToOne(() => User, (user) => user.cart, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User | null

  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.cart)
  products: CartProduct[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

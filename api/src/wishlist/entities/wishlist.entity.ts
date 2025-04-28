import { Product } from '@/products/entities/product.entity'
import { User } from '@/users/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryColumn
} from 'typeorm'
import { v4 } from 'uuid'

export enum WishlistType {
  FAVOURITES = 'favourites',
  COMPARISON = 'comparison',
  VIEWED = 'viewed'
}
@Entity()
export class Wishlist {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  id = v4()

  @Column({ type: 'int', nullable: true })
  userId: number | null

  @OneToOne(() => User, (user) => user.cart, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  user: User | null

  @Column({ type: 'enum', enum: WishlistType })
  type!: WishlistType

  @ManyToMany(() => Product)
  products: Product[]

  @CreateDateColumn()
  createdAt: Date
}

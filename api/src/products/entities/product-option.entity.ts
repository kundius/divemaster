import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Property } from './property.entity'
import { Product } from './product.entity'
import { Offer } from './offer.entity'

@Entity()
export class ProductOption {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  productId: number

  @ManyToOne(() => Product, (product) => product.options, { onDelete: 'CASCADE' })
  product: Product

  @Column()
  name!: string

  @Column()
  content!: string

  @Column({ default: 0 })
  rank: number = 0
}

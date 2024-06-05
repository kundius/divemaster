import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Product } from './product.entity'

@Entity()
export class ProductContent {
  @PrimaryKey()
  id: number

  @Property()
  title: string

  @Property()
  content: string

  @Property({ default: 0 })
  rank: number = 0

  @ManyToOne(() => Product, { primary: true })
  product: Product
}

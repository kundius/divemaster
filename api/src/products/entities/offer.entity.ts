import { Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { OptionValue } from './option-value.entity'
import { Product } from './product.entity'

@Entity()
export class Offer {
  @PrimaryKey()
  id: number

  @Property({ nullable: true, type: 'varchar' })
  title: string | null = null

  @Property()
  price: number

  @Property({ default: 0 })
  rank: number = 0

  @ManyToMany(() => OptionValue)
  optionValues = new Collection<OptionValue>(this)

  @ManyToOne(() => Product)
  product!: Product
}

import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Product } from './product.entity'
import { Option } from './option.entity'

@Entity()
export class OptionValue {
  @PrimaryKey()
  id!: number

  @Property()
  content!: string

  @ManyToOne(() => Option)
  option: Option

  @ManyToOne(() => Product)
  product: Product

  @Property({ default: 0 })
  rank: number = 0

  @Property({ type: 'json', nullable: true })
  properties: Record<string, string> | null = null
}

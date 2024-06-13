import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Category } from './category.entity'
import { OptionVariant } from './option-variant.entity'

export enum OptionType {
  // RANGE = 'range',
  // BOOLEAN = 'boolean',
  COLOR = 'color',
  SIZE = 'size',
  VARIANT = 'variant'
}

@Entity()
export class Option {
  @PrimaryKey()
  id!: number

  @Property({ unique: true })
  key!: string

  @Property()
  caption!: string

  @Enum(() => OptionType)
  type!: OptionType

  @Property({ default: false })
  inFilter: boolean = false

  @Property({ default: false })
  inCart: boolean = false

  @Property({ default: 0 })
  rank: number = 0

  @ManyToMany(() => Category, (category) => category.options)
  categories = new Collection<Category>(this)

  @OneToMany(() => OptionVariant, (variant) => variant.option)
  variants = new Collection<OptionVariant>(this)
}

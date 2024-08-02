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
import { OptionValue } from './option-value.entity'

export enum OptionType {
  // STRING = 'string',
  // NUMBER = 'number',
  // BOOLEAN = 'boolean',
  // COLOR = 'color',
  // SIZE = 'size',

  // CHECKBOX = 'checkbox',
  // COMBOMULTIPLE = 'combo-multiple',
  COMBOBOOLEAN = 'combo-boolean',
  COMBOCOLORS = 'combo-colors',
  COMBOOPTIONS = 'combo-options',
  // COMBOBOX = 'combobox',
  // DATEFIELD = 'datefield',
  NUMBERFIELD = 'numberfield',
  TEXTFIELD = 'textfield'
  // TEXTAREA = 'textarea'
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

  @Property({ default: 0 })
  rank: number = 0

  @ManyToMany(() => Category, (category) => category.options)
  categories = new Collection<Category>(this)

  @OneToMany(() => OptionValue, (value) => value.option)
  values = new Collection<OptionValue>(this)
}

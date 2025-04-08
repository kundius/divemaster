import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './category.entity'
import { OptionValue } from './option-value.entity'

export enum PropertyType {
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

@Entity({
  name: 'option'
})
export class Property {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  key!: string

  @Column()
  caption!: string

  @Column({
    type: 'enum',
    enum: PropertyType
  })
  type!: PropertyType

  @Column({ default: false })
  inFilter: boolean = false

  @Column({ default: 0 })
  rank: number = 0

  @ManyToMany(() => Category, (category) => category.options)
  @JoinTable({ name: 'category_options' })
  categories: Category[]

  @OneToMany(() => OptionValue, (value) => value.option)
  values: OptionValue[]
}

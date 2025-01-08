import { Category } from './category.entity'
import { OptionValue } from './option-value.entity'
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  key!: string

  @Column()
  caption!: string

  @Column({
    type: 'enum',
    enum: OptionType
  })
  type!: OptionType

  @Column({ default: false })
  inFilter: boolean = false

  @Column({ default: 0 })
  rank: number = 0

  @ManyToMany(() => Category, (category) => category.options)
  categories: Category[]

  @OneToMany(() => OptionValue, (value) => value.option)
  values: OptionValue[]
}

import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'
import { OptionValue } from './option-value.entity'

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'varchar' })
  remoteId?: string | null = null

  @Column({ nullable: true, type: 'varchar' })
  title: string | null = null

  @Column()
  price: number

  @Column({ default: 0 })
  rank: number = 0

  @ManyToMany(() => OptionValue, optionValue => optionValue.offers)
  @JoinTable({ name: 'offer_option_values' })
  optionValues: OptionValue[]

  @Column()
  productId: number

  @ManyToOne(() => Product)
  product: Product
}

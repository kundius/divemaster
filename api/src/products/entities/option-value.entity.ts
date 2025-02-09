import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Option } from './option.entity'
import { Product } from './product.entity'
import { Offer } from './offer.entity'

@Entity()
export class OptionValue {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content!: string

  @Column()
  optionId: number

  @ManyToOne(() => Option)
  option: Option

  @Column()
  productId: number

  @ManyToOne(() => Product, (product) => product.optionValues, { onDelete: 'CASCADE' })
  product: Product

  @Column({ default: 0 })
  rank: number = 0

  @Column({ type: 'simple-json', nullable: true })
  properties: Record<string, string> | null

  @ManyToMany(() => Offer, offer => offer.optionValues)
  offers: Offer[]
}

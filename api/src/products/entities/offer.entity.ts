import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'
import { OptionValue } from './option-value.entity'
import { OfferOption } from './offer-option.entity'

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'varchar' })
  remoteId?: string | null

  @Column({ nullable: true, type: 'varchar' })
  title?: string | null

  @Column()
  price: number

  @Column({ default: 0 })
  rank: number = 0

  // TODO remove
  @ManyToMany(() => OptionValue, (optionValue) => optionValue.offers, { cascade: true })
  @JoinTable({
    name: 'offer_option_values'
  })
  optionValues: OptionValue[]

  @Column()
  productId: number

  @ManyToOne(() => Product, (product) => product.offers, { onDelete: 'CASCADE' })
  product: Product
  
  @OneToMany(() => OfferOption, (option) => option.offer)
  options: OfferOption[]
}

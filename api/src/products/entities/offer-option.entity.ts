import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Property } from './property.entity'
import { Product } from './product.entity'
import { Offer } from './offer.entity'

@Entity()
export class OfferOption {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  offerId: number

  @ManyToOne(() => Offer, (offer) => offer.options, { onDelete: 'CASCADE' })
  offer: Offer

  @Column()
  name!: string

  @Column()
  content!: string
}

import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { OptionValue } from './option-value.entity'
import { Product } from './product.entity'

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

  @ManyToMany(() => OptionValue)
  optionValues: OptionValue[]

  @ManyToOne(() => Product)
  product!: Product
}

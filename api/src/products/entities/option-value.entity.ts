import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Option } from './option.entity'
import { Product } from './product.entity'

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

  @ManyToOne(() => Product)
  product: Product

  @Column({ default: 0 })
  rank: number = 0

  @Column({ type: 'simple-json', nullable: true })
  properties: Record<string, string> | null
}

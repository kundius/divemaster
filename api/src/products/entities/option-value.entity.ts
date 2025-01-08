import { Product } from './product.entity'
import { Option } from './option.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class OptionValue {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  content!: string

  @ManyToOne(() => Option)
  option: Option

  @ManyToOne(() => Product)
  product: Product

  @Column({ default: 0 })
  rank: number = 0

  @Column({ type: 'json', nullable: true })
  properties: Record<string, string> | null = null
}

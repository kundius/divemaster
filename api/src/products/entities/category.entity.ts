import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ unique: true })
  alias: string

  @Column({ nullable: true, type: 'text' })
  description?: string

  @Column({ default: true })
  active: boolean

  @ManyToMany(() => Product)
  products: Product[]
}

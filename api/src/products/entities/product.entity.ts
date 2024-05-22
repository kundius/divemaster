import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm'
import { Category } from './category.entity'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ unique: true })
  alias: string

  @Column({ nullable: true })
  sku?: string

  @Column()
  price: number

  @Column({ nullable: true, type: 'text' })
  description?: string

  @Column({ default: true })
  active: boolean

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[]
}

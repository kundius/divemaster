import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm'
import { Product } from './product.entity'
import { Property } from './property.entity'
import { File } from '@/storage/entities/file.entity'

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'varchar' })
  remoteId: string | null

  @Column()
  title: string

  @Column({ nullable: true, type: 'varchar' })
  longTitle: string | null

  @Column({ unique: true })
  alias: string

  @Column({ default: 0 })
  rank: number = 0

  @Column({ nullable: true, type: 'text' })
  description: string | null

  @Column({ default: true })
  active: boolean

  @Column({ nullable: true })
  imageId: number | null

  @ManyToOne(() => File, { nullable: true })
  image: File | null

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[]

  @ManyToMany(() => Property, (option) => option.categories)
  options: Property[]

  @Column({ nullable: true, type: 'integer' })
  parentId: number | null

  @ManyToOne(() => Category, { nullable: true })
  parent: Category | null
}

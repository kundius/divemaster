import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, ManyToMany } from 'typeorm'
import { Product } from './product.entity'
import { Option } from './option.entity'
import { File } from '@/storage/entities/file.entity'

@Entity()
export class Category {
  // @PrimaryGeneratedColumn()
  // id: number

  // @Column()
  // firstName: string

  // @Column()
  // lastName: string

  // @Column({ default: true })
  // isActive: boolean

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'varchar' })
  remoteId?: string | null = null

  @Column()
  title: string

  @Column({ nullable: true, type: 'varchar' })
  longTitle?: string | null = null

  @Column({ unique: true })
  alias: string

  @Column({ default: 0 })
  rank: number = 0

  @Column({ nullable: true, type: 'text' })
  description: string | null = null

  @Column({ default: true })
  active: boolean

  @Column({ nullable: true })
  imageId: number | null

  @ManyToOne(() => File, { nullable: true })
  image: File | null

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[]

  @ManyToMany(() => Option, (option) => option.categories)
  options: Option[]

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[]

  @Column({ nullable: true, type: 'integer' })
  parentId: number | null

  @ManyToOne(() => Category, { nullable: true })
  parent: Category | null
}

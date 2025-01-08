import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'
import { Option } from './option.entity'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Category {
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

  @ManyToOne(() => File, { nullable: true })
  image: File | null = null

  @ManyToMany(() => Product)
  products: Product[]

  @ManyToMany(() => Option)
  options: Option[]

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[]

  @ManyToOne(() => Category, { nullable: true })
  parent: Category | null = null
}

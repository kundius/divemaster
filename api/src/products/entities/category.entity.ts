import {
  Collection,
  Entity,
  Filter,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'
import { Option } from './option.entity'

@Entity()
@Filter({ name: 'active', cond: { active: { $eq: true } } })
export class Category {
  @PrimaryKey()
  id: number

  @Property()
  title: string

  @Property({ nullable: true, type: 'varchar' })
  longTitle?: string | null = null

  @Property({ unique: true })
  alias: string

  @Property({ nullable: true, type: 'text' })
  description: string | null = null

  @Property({ default: true })
  active: boolean

  @ManyToOne(() => File, { nullable: true })
  image: File | null = null

  @ManyToMany(() => Product)
  products = new Collection<Product>(this)

  @ManyToMany(() => Option)
  options = new Collection<Option>(this)

  @OneToMany(() => Category, (category) => category.parent)
  children = new Collection<Category>(this)

  @ManyToOne(() => Category, { nullable: true })
  parent: Category | null = null
}

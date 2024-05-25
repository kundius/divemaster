import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { Product } from './product.entity'

@Entity()
export class Category {
  @PrimaryKey()
  id: number

  @Property()
  title: string

  @Property({ unique: true })
  alias: string

  @Property({ nullable: true, type: 'text' })
  description?: string

  @Property({ default: true })
  active: boolean

  @ManyToMany(() => Product)
  products = new Collection<Product>(this)

  @OneToMany(() => Category, (category) => category.parent)
  children = new Collection<Category>(this)

  @ManyToOne(() => Category, { nullable: true })
  parent?: Category
}

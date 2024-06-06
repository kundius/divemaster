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
import { Category } from './category.entity'
import { ProductImage } from './product-image.entity'
import { Brand } from './brand.entity'

@Entity()
@Filter({ name: 'active', cond: { active: { $eq: true } } })
@Filter({ name: 'recent', cond: { recent: { $eq: true } } })
@Filter({ name: 'favorite', cond: { favorite: { $eq: true } } })
@Filter({ name: 'inStock', cond: { inStock: { $eq: true } } })
export class Product {
  @PrimaryKey()
  id: number

  @Property()
  title: string

  @Property({ nullable: true, type: 'varchar' })
  longTitle?: string | null = null

  @Property({ unique: true })
  alias: string

  @Property({ nullable: true, type: 'varchar' })
  sku?: string | null = null

  @Property()
  price: number

  @Property({ nullable: true, type: 'int' })
  oldPrice: number | null = null

  @Property({ nullable: true, type: 'text' })
  description: string | null = null

  @Property({ nullable: true, type: 'text' })
  specifications: string | null = null

  @Property({ nullable: true, type: 'text' })
  exploitation: string | null = null

  @Property({ default: true })
  active: boolean = true

  @Property({ default: true })
  inStock: boolean = true

  @Property({ default: false })
  recent: boolean = false

  @Property({ default: false })
  favorite: boolean = false

  @ManyToMany(() => Category, (category) => category.products)
  categories = new Collection<Category>(this)

  @OneToMany(() => ProductImage, (image) => image.product)
  images = new Collection<ProductImage>(this)

  @ManyToOne(() => Brand, { nullable: true })
  brand: Brand | null = null
}

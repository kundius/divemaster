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
import { Brand } from './brand.entity'
import { Category } from './category.entity'
import { Option } from './option.entity'
import { ProductImage } from './product-image.entity'
import { OptionValue } from './option-value.entity'
import { Offer } from './offer.entity'

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

  @OneToMany(() => OptionValue, (optionValue) => optionValue.product)
  optionValues = new Collection<OptionValue>(this)

  @OneToMany(() => Offer, (offer) => offer.product)
  offers = new Collection<Offer>(this)

  @ManyToOne(() => Brand, { nullable: true })
  brand: Brand | null = null

  // ручная выборка опций товаров
  @Property({ persist: false })
  options?: Option[]
}

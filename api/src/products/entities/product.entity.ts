import { Collection, Entity, ManyToMany, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Category } from './category.entity'
import { ProductImage } from './product-image.entity'

@Entity()
export class Product {
  @PrimaryKey()
  id: number

  @Property()
  title: string

  @Property({ unique: true })
  alias: string

  @Property({ nullable: true })
  sku?: string

  @Property()
  price: number

  @Property({ nullable: true, type: 'text' })
  description?: string

  @Property({ default: true })
  active: boolean

  @ManyToMany(() => Category, (category) => category.products)
  categories = new Collection<Category>(this)

  @OneToMany(() => ProductImage, (image) => image.product)
  images = new Collection<ProductImage>(this)
}

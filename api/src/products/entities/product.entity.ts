import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm'
import { Category } from './category.entity'
import { ProductImage } from './product-image.entity'
import { OptionValue } from './option-value.entity'
import { Offer } from './offer.entity'
import { Brand } from './brand.entity'
import { Option } from './option.entity'

@Entity()
export class Product {
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

  @Column({ nullable: true, type: 'varchar' })
  sku?: string | null = null

  @Column({ default: 0 })
  rank: number = 0

  @Column({ nullable: true, type: 'int' })
  priceDecrease: number | null = null

  @Column({ nullable: true, type: 'text' })
  description: string | null = null

  @Column({ nullable: true, type: 'text' })
  specifications: string | null = null

  @Column({ nullable: true, type: 'text' })
  exploitation: string | null = null

  @Column({ default: true })
  active: boolean = true

  @Column({ default: true })
  inStock: boolean = true

  @Column({ default: false })
  recent: boolean = false

  @Column({ default: false })
  favorite: boolean = false

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'category_products' })
  categories: Category[]

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[]

  @OneToMany(() => OptionValue, (optionValue) => optionValue.product, { cascade: true })
  optionValues: OptionValue[]

  @OneToMany(() => Offer, (offer) => offer.product, { cascade: true })
  offers: Offer[]

  @Column({ type: 'int', nullable: true })
  brandId: number | null

  @ManyToOne(() => Brand, { nullable: true })
  brand: Brand | null

  // для ручной подготовки опций товаров
  options?: Option[]
}

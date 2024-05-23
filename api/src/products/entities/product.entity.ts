import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Category } from './category.entity'
import { ProductImage } from './product-image.entity'

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

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[]

  // @ManyToMany(() => File)
  // @JoinTable({
  //   name: 'product_images_file',
  //   joinColumn: {
  //     name: 'productId',
  //     referencedColumnName: 'id'
  //   },
  //   inverseJoinColumn: {
  //     name: 'fileId',
  //     referencedColumnName: 'id'
  //   }
  // })
  // images: File[]
}

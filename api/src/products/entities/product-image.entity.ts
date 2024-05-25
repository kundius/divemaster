import { File } from '@/storage/entities/file.entity'
import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core'
import { Product } from './product.entity'

@Entity()
export class ProductImage {
  [PrimaryKeyProp]?: ['file', 'product']

  // @PrimaryKey()
  // fileId: number

  // @PrimaryKey()
  // productId: number

  // @PrimaryKey()
  @ManyToOne(() => File, { primary: true })
  file: File

  // @PrimaryKey()
  @ManyToOne(() => Product, { primary: true })
  product: Product

  @Property({ default: 0 })
  rank: number = 0

  @Property({ default: true })
  active: boolean = true
}

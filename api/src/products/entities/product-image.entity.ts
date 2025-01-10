import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'

@Entity()
export class ProductImage {
  @PrimaryColumn()
  fileId: number

  @PrimaryColumn()
  productId: number

  @ManyToOne(() => File)
  file: File

  @ManyToOne(() => Product, (product) => product.images)
  product: Product

  @Column({ default: 0 })
  rank: number = 0

  @Column({ default: true })
  active: boolean = true
}

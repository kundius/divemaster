import { File } from '@/storage/entities/file.entity'
import { Product } from './product.entity'
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity()
export class ProductImage {
  @PrimaryColumn()
  fileId: string;

  @PrimaryColumn()
  productId: number;
  
  @ManyToOne(() => File)
  file: File

  @ManyToOne(() => Product)
  product: Product

  @Column({ default: 0 })
  rank: number = 0

  @Column({ default: true })
  active: boolean = true
}

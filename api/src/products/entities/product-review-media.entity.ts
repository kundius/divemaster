import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'
import { ProductReview } from './product-review.entity'

@Entity()
export class ProductReviewMedia {
  @PrimaryColumn()
  fileId: number

  @ManyToOne(() => File, { onDelete: 'CASCADE' })
  file: File

  @PrimaryColumn()
  reviewId: number

  @ManyToOne(() => ProductReview, (review) => review.media, { onDelete: 'CASCADE' })
  review: ProductReview

  @Column({ default: 0 })
  rank: number = 0
}

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'
import { Review } from './review.entity'

@Entity()
export class ReviewMedia {
  @PrimaryColumn()
  fileId: number

  @ManyToOne(() => File, { onDelete: 'CASCADE' })
  file: File

  @PrimaryColumn()
  reviewId: number

  @ManyToOne(() => Review, (review) => review.media, { onDelete: 'CASCADE' })
  review: Review

  @Column({ default: 0 })
  rank: number = 0
}

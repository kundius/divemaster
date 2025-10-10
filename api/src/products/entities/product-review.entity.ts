import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Property } from './property.entity'
import { Product } from './product.entity'
import { Offer } from './offer.entity'
import { User } from '@/users/entities/user.entity'
import { ProductReviewMedia } from './product-review-media.entity'
import { ProductReviewReply } from './product-review-reply.entity'

@Entity()
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'text' })
  advantages: string | null

  @Column({ nullable: true, type: 'text' })
  flaws: string | null

  @Column({ nullable: true, type: 'text' })
  comment: string | null

  @Column({ type: 'int', nullable: true })
  userId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User | null

  @Column()
  productId: number

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product

  @OneToMany(() => ProductReviewMedia, (media) => media.review, { cascade: true })
  media: ProductReviewMedia[]

  @OneToOne(() => ProductReviewReply, (reply) => reply.review, {
    nullable: true
  })
  reply: ProductReviewReply | null

  @CreateDateColumn()
  createdAt: Date
}

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
import { ReviewMedia } from './review-media.entity'
import { ReviewReply } from './review-reply.entity'

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text', nullable: true })
  advantages: string | null

  @Column({ type: 'text', nullable: true })
  flaws: string | null

  @Column({ type: 'text', nullable: true })
  comment: string | null

  @Column({ type: 'text', nullable: true })
  author: string | null

  @Column({ type: 'int', nullable: true })
  userId: number | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User | null

  @Column()
  productId: number

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product

  @OneToMany(() => ReviewMedia, (media) => media.review, { cascade: true })
  media: ReviewMedia[]

  @OneToOne(() => ReviewReply, (reply) => reply.review, {
    nullable: true
  })
  reply: ReviewReply | null

  @Column({ default: false })
  isPublished: boolean

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @Column()
  isRecommended: boolean

  @Column()
  rating: number
}

import { User } from '@/users/entities/user.entity'
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Review } from './review.entity'

@Entity()
export class ReviewReply {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  reviewId: number

  @OneToOne(() => Review, (review) => review.reply, { onDelete: 'CASCADE' })
  @JoinColumn()
  review: Review

  @Column({ type: 'text' })
  comment: string

  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @Column({ type: 'timestamp' })
  publishedAt: Date
}

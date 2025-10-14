import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'
import { Review } from './review.entity'
import { User } from '@/users/entities/user.entity'

@Entity()
export class ReviewReply {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  reviewId: number

  @OneToOne(() => Review, (review) => review.reply, { onDelete: 'CASCADE' })
  @JoinColumn()
  review: Review

  @Column()
  comment: string

  @Column()
  userId: number

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User

  @CreateDateColumn()
  createdAt: Date
}

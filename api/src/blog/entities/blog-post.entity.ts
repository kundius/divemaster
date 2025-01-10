import { File } from '@/storage/entities/file.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { BlogTag } from './blog-tag.entity'

export enum BlogPostStatusEnum {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived'
}

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true, type: 'varchar' })
  longTitle?: string | null = null

  @Column({ unique: true })
  alias: string

  @Column({ nullable: true, type: 'text' })
  content: string | null = null

  @Column({ nullable: true, type: 'varchar' })
  readTime: string | null = null

  @Column({
    type: 'enum',
    enum: BlogPostStatusEnum,
    default: BlogPostStatusEnum.Draft
  })
  status: BlogPostStatusEnum = BlogPostStatusEnum.Draft

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, string> | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToMany(() => BlogTag, (tag) => tag.posts)
  @JoinTable({ name: 'blog_tag_posts' })
  tags: BlogTag[]

  @Column({ nullable: true })
  imageId: number | null

  @ManyToOne(() => File, { nullable: true })
  image: File | null
}

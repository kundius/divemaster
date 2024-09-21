import { File } from '@/storage/entities/file.entity'
import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { BlogTag } from './blog-tag.entity'

export enum BlogPostStatusEnum {
  Published = 'published',
  Draft = 'draft',
  Archived = 'archived'
}

@Entity()
export class BlogPost {
  @PrimaryKey()
  id: number

  @Property()
  title: string

  @Property({ nullable: true, type: 'varchar' })
  longTitle?: string | null = null

  @Property({ unique: true })
  alias: string

  @Property({ nullable: true, type: 'text' })
  content: string | null = null

  @Property({ nullable: true, type: 'varchar' })
  readTime: string | null = null

  @Enum({
    items: () => BlogPostStatusEnum,
    default: BlogPostStatusEnum.Draft
  })
  status: BlogPostStatusEnum = BlogPostStatusEnum.Draft

  @Property({ type: 'json', nullable: true })
  metadata: Record<string, string> | null = null

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()

  @ManyToMany(() => BlogTag, (tag) => tag.posts)
  tags = new Collection<BlogTag>(this)

  @ManyToOne(() => File, { nullable: true })
  image: File | null = null
}

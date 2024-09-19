import { Collection, Entity, ManyToMany, ManyToOne, Opt, PrimaryKey, Property } from '@mikro-orm/core'
import { BlogTag } from './blog-tag.entity'
import { File } from '@/storage/entities/file.entity'

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

  @Property({ default: true })
  active: boolean = true

  @Property({ type: 'json', nullable: true })
  seo: Record<string, string> | null = null

  @Property()
  createdAt: Date & Opt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date()

  @ManyToMany(() => BlogTag, (tag) => tag.posts)
  tags = new Collection<BlogTag>(this)

  @ManyToOne(() => File, { nullable: true })
  image: File | null = null
}

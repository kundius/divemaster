import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { BlogPost } from './blog-post.entity'

@Entity()
export class BlogTag {
  @PrimaryKey()
  id: number

  @Property()
  name: string

  @Property({ unique: true })
  alias: string

  @Property({ type: 'json', nullable: true })
  metadata: Record<string, string> | null = null

  @ManyToMany(() => BlogPost)
  posts = new Collection<BlogPost>(this)

  @Property({ persist: false })
  postsTotal?: number
}

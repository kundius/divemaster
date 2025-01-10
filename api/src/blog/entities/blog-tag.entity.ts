import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BlogPost } from './blog-post.entity'

@Entity()
export class BlogTag {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ unique: true })
  alias: string

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, string> | null

  @ManyToMany(() => BlogPost, (post) => post.tags)
  posts: BlogPost[]

  postsTotal?: number
}

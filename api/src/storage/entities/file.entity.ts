import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class File {
  @PrimaryKey()
  id: number

  @Property()
  file: string

  @Property()
  path: string

  @Property()
  hash: string

  @Property()
  type: string

  @Property()
  size: number

  @Property({ nullable: true, type: 'json' })
  metadata?: Record<string, any>

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()
}

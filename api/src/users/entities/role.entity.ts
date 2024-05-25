import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { User } from './user.entity'

@Entity()
export class Role {
  @PrimaryKey()
  id: number

  @Property({ unique: true })
  title: string

  @Property({ nullable: true, type: 'json' })
  scope?: Array<string>

  @OneToMany(() => User, (user) => user.role)
  users = new Collection<User>(this)
}

import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Role } from './role.entity'

@Entity()
export class User {
  @PrimaryKey()
  id: number

  @Property({ unique: true })
  email: string

  @Property()
  name: string

  @Property()
  password: string

  @Property({ default: true })
  active: boolean

  @ManyToOne(() => Role)
  role: Role
}

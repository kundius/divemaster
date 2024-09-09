import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class City {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @Property()
  type!: string

  @Property()
  name!: string

  @Property()
  subject!: string

  @Property()
  district!: string

  @Property({ type: 'float' })
  lat!: number

  @Property({ type: 'float' })
  lon!: number
}

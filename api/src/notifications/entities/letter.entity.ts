import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core'
import { v4 } from 'uuid'

export enum LetterStatus {
  Sent = 'sent',
  Received = 'received',
  Read = 'read',
  Fail = 'fail'
}

@Entity()
export class Letter {
  @PrimaryKey({ type: 'uuid' })
  uuid: string = v4()

  @Property()
  to!: string

  @Property()
  from!: string

  @Property({ nullable: true })
  messageId?: string

  @Enum(() => LetterStatus)
  status!: LetterStatus

  @Property()
  readCount!: number

  @Property()
  statusUpdatedAt!: Date

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()
}

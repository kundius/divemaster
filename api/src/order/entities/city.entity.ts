import { Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 } from 'uuid'

@Entity()
export class City {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  id = v4()

  @Column()
  type!: string

  @Column()
  name!: string

  @Column()
  subject!: string

  @Column()
  district!: string

  @Column({ type: 'float' })
  lat!: number

  @Column({ type: 'float' })
  lon!: number
}

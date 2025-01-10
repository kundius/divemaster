import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ type: 'simple-array', nullable: true })
  scope: Array<string> | null
}

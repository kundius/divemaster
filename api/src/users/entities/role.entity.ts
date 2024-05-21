import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @Column({ nullable: true, type: 'json' })
  scope?: Array<string>

  @OneToMany(() => User, (user) => user.role)
  users: User[]
}

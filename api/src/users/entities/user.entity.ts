import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Role } from './role.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column()
  password: string

  @Column({ default: true })
  active: boolean

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role: Role
}

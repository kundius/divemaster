import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  file: string

  @Column()
  path: string

  @Column()
  hash: string

  @Column()
  type: string

  @Column()
  size: number

  @Column({ nullable: true, type: 'json' })
  metadata?: Record<string, any>

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

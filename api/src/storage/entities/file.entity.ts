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

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any> | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

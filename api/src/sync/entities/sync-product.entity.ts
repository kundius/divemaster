import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SyncTask } from './sync-task.entity'

@Entity()
export class SyncProduct {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => SyncTask)
  syncTask: SyncTask
}

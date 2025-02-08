import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SyncTask } from './sync-task.entity'

@Entity()
export class SyncProduct {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  remoteId: string

  @Column({ type: 'varchar' })
  sku: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'text' })
  description: string

  @Column({ type: 'text' })
  categories: string

  @Column({ type: 'text' })
  images: string

  @Column({ type: 'varchar' })
  brand: string

  @Column({ type: 'varchar' })
  favorite: string

  @Column({ type: 'varchar' })
  recent: string

  @Column({ type: 'text' })
  options: string

  @Column({ type: 'text' })
  offers: string

  @Column()
  syncTaskId: number

  @ManyToOne(() => SyncTask, (syncTask) => syncTask.syncProducts, { onDelete: 'CASCADE' })
  syncTask: SyncTask
}

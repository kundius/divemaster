import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { SyncProduct } from './sync-product.entity'

export enum SyncTaskStatus {
  INITIALIZATION = 'initialization',
  SYNCHRONIZATION = 'synchronization',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled', // end
  SUCCESS = 'success', // end
  ERROR = 'error', // end
}

export enum SyncTaskProvider {
  ARCHIVE = 'archive',
}

@Entity()
export class SyncTask {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'enum',
    enum: SyncTaskStatus
  })
  status!: SyncTaskStatus

  @Column({ nullable: true, type: 'varchar' })
  statusMessage?: string | null

  @Column({
    type: 'enum',
    enum: SyncTaskProvider
  })
  provider!: SyncTaskProvider

  @Column({ default: 0 })
  total: number

  @Column({ default: 0 })
  offset: number

  @Column({ default: 0 })
  created: number

  @Column({ default: 0 })
  updated: number

  @Column({ default: 0 })
  skipped: number

  @Column({ type: 'simple-json', nullable: true })
  properties: Record<string, string> | null

  @ManyToMany(() => SyncProduct)
  syncProducts: SyncProduct[]
}

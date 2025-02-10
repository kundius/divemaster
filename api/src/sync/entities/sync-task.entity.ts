import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { SyncProduct } from './sync-product.entity'

export enum SyncTaskStatus {
  INITIALIZATION = 'initialization',
  SYNCHRONIZATION = 'synchronization',
  // SUSPENDED = 'suspended',
  // CANCELLED = 'cancelled', // end
  SUCCESS = 'success', // end
  ERROR = 'error' // end
}

@Entity()
export class SyncTask {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  uuid: string

  @Column({
    type: 'enum',
    enum: SyncTaskStatus
  })
  status!: SyncTaskStatus

  @Column({ nullable: true, type: 'varchar' })
  statusMessage?: string | null

  @Column({ default: 0 })
  total: number

  @Column({ default: 0 })
  offset: number

  @Column({ default: false })
  busy: boolean

  @Column({ default: 0 })
  created: number

  @Column({ default: 0 })
  updated: number

  @Column({ default: 0 })
  skipped: number

  @Column({ type: 'simple-json', nullable: true })
  properties: Record<string, string> | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => SyncProduct, (syncProduct) => syncProduct.syncTask, { cascade: true })
  syncProducts: SyncProduct[]
}

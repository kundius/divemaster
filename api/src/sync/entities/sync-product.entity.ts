import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { SyncTask } from './sync-task.entity'

@Entity()
export class SyncProduct {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'varchar' })
  remoteId: string | null

  @Column({ nullable: true, type: 'varchar' })
  sku: string | null

  @Column({ nullable: true, type: 'varchar' })
  name: string | null

  @Column({ nullable: true, type: 'text' })
  description: string | null

  @Column({ nullable: true, type: 'text' })
  categories: string | null

  @Column({ nullable: true, type: 'text' })
  images: string | null

  @Column({ nullable: true, type: 'varchar' })
  brand: string | null

  @Column({ nullable: true, type: 'varchar' })
  favorite: string | null

  @Column({ nullable: true, type: 'varchar' })
  recent: string | null

  @Column({ nullable: true, type: 'text' })
  options: string | null

  @Column({ nullable: true, type: 'text' })
  offers: string | null

  @Column()
  syncTaskId: number

  @ManyToOne(() => SyncTask)
  syncTask: SyncTask
}

        // {
        //   remoteId: 'a336e3e4-7cbf-11ef-9fdf-d58c26e63fce',
        //   sku: 423928,
        //   name: 'Буй MARES Tech Torpedo в оболочке',
        //   description: 'Буй торпедо MARES в оболочке. Используется для обозначения места погружения дайвера или охотника. Можно использовать для крепления кукана. Яркий цвет , хорошо заметен.',
        //   categories: '[["Всё для подводной охоты","Буи, буксировщики, плоты"]]',
        //   images: '["import_files/a3/a336e3e4-7cbf-11ef-9fdf-d58c26e63fce_a336e3e6-7cbf-11ef-9fdf-d58c26e63fce.jpeg"]',
        //   brand: 'MARES',
        //   favorite: '0',
        //   recent: '0',
        //   offers: '[{"price":5040,"remoteId":"a336e3e4-7cbf-11ef-9fdf-d58c26e63fce","name":"Буй MARES Tech Torpedo в оболочке","options":{}}]'
        // },
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'
import { File } from '@/storage/entities/file.entity'

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true, type: 'text' })
  description: string | null

  @Column({ nullable: true, type: 'varchar' })
  remoteId?: string | null = null

  @Column({ nullable: true, type: 'varchar' })
  alias: string | null = null

  @Column({ nullable: true })
  imageId: number | null

  @ManyToOne(() => File, { nullable: true })
  image: File | null

  @ManyToMany(() => Product)
  products: Product[]
}

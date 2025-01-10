import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './product.entity'

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, type: 'varchar' })
  remoteId?: string | null = null

  @Column()
  title: string

  @ManyToMany(() => Product)
  products: Product[]
}

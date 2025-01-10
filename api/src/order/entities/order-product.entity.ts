import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Order } from './order.entity'
import { Product } from '@/products/entities/product.entity'

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  order!: Order

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  product: Product | null

  @Column({ unsigned: true })
  quantity!: number

  @Column({ unsigned: true })
  price!: number

  @Column()
  title!: string

  @Column({ type: 'simple-json', nullable: true })
  options: Record<string, string> | null
}

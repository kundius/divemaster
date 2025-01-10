import { User } from "@/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderProduct } from "./order-product.entity";
import { Payment } from "./payment.entity";
import { Delivery } from "./delivery.entity";


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  hash!: string

  @Column({ unsigned: true })
  cost!: number

  @Column({ type: 'simple-json', nullable: true })
  composition: Array<{ name: string; value: number }> | null

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User | null

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  products: OrderProduct[]

  @OneToOne(() => Payment, (payment) => payment.order, { orphanedRowAction: 'delete' })
  payment!: Payment

  @OneToOne(() => Delivery, (delivery) => delivery.order, { orphanedRowAction: 'delete' })
  delivery!: Delivery
  
  @CreateDateColumn()
  createdAt: Date
}
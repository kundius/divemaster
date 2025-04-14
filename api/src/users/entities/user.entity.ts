import { Exclude } from "class-transformer"
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Role } from "./role.entity"
import { Cart } from "@/cart/entities/cart.entity"

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  name: string

  @Column({ nullable: true, type: 'text' })
  phone: string | null = null

  @Column()
  @Exclude()
  password: string

  @Column({ default: true })
  active: boolean

  @Column({ default: 0 })
  discount: number

  @Column({ type: 'simple-json', nullable: true })
  address: Record<string, string> | null

  @Column({ nullable: true })
  roleId: number | null

  @ManyToOne(() => Role)
  role: Role

  @OneToOne(() => Cart, (cart) => cart.user, { nullable: true })
  cart: Cart | null
}
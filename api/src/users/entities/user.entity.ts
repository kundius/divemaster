import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { Role } from './role.entity'
import { Cart } from '@/cart/entities/cart.entity'

@Entity()
export class User {
  @PrimaryKey()
  id: number

  @Property({ unique: true })
  email: string

  @Property()
  name: string

  @Property({ hidden: true })
  password: string

  @Property({ default: true })
  active: boolean

  @ManyToOne(() => Role)
  role: Role

  @OneToOne(() => Cart, (cart) => cart.user, { nullable: true })
  cart: Cart | null
}

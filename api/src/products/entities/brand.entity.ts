import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/core'
import { Product } from './product.entity'

@Entity()
export class Brand {
  @PrimaryKey()
  id: number

  @Property({ nullable: true, type: 'varchar' })
  remoteId?: string | null = null

  @Property()
  title: string

  @ManyToMany(() => Product)
  products = new Collection<Product>(this)
}

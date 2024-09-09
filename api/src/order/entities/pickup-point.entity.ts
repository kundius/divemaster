import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class PickupPoint {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @Property()
  name: string

  @Property()
  districtName: string

  @Property()
  subjectName: string

  @Property()
  cityType: string

  @Property()
  cityName: string

  @Property()
  fullAddress: string

  @Property()
  shortAddress: string

  @Property({ type: 'varchar', nullable: true })
  phone: string | null = null

  @Property({ type: 'varchar', nullable: true })
  email: string | null = null

  @Property()
  workTime: string

  @Property({ type: 'float' })
  lat: number

  @Property({ type: 'float' })
  lon: number

  // Примечание по офису
  @Property({ type: 'varchar', nullable: true })
  note: string | null = null

  // Есть ли в офисе приём заказов
  @Property({ default: false })
  isReception: boolean = false

  // Наличие примерочной
  @Property({ default: false })
  isDressingRoom: boolean = false

  // Разрешен наложенный платеж
  @Property({ default: false })
  allowedCod: boolean = false

  // Есть прием наличных
  @Property({ default: false })
  haveCash: boolean = false

  // Наличие терминала оплаты
  @Property({ default: false })
  haveCashless: boolean = false
}

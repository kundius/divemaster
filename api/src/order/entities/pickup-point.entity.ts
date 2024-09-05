import {
  Entity,
  PrimaryKey,
  Property
} from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class PickupPoint {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @Property()
  region: string = ''

  @Property()
  address: string = ''

  @Property()
  phone: string = ''

  @Property()
  email: string = ''

  @Property()
  timetable: string = ''

  // Примечание по офису
  @Property()
  note: string = ''

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

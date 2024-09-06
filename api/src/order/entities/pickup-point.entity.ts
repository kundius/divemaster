import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity()
export class PickupPoint {
  @PrimaryKey({ type: 'uuid' })
  id = v4()

  @Property({ default: '' })
  name: string = ''

  @Property({ default: '' })
  regionCode: string = ''

  @Property({ default: '' })
  regionName: string = ''

  @Property({ default: '' })
  cityCode: string = ''

  @Property({ default: '' })
  cityName: string = ''

  @Property({ default: '' })
  fullAddress: string = ''

  @Property({ default: '' })
  address: string = ''

  @Property({ default: '' })
  phone: string = ''

  @Property({ default: '' })
  email: string = ''

  @Property({ default: '' })
  workTime: string = ''

  @Property({ default: '' })
  lat: string = ''

  @Property({ default: '' })
  lon: string = ''

  // Примечание по офису
  @Property({ default: '' })
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

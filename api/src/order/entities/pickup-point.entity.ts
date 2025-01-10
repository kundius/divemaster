import { Column, Entity, PrimaryColumn } from 'typeorm'
import { v4 } from 'uuid'

export enum PickupPointTypeEnum {
  cdek = 'cdek',
  store = 'store'
}

@Entity()
export class PickupPoint {
  @PrimaryColumn({ type: 'uuid', length: 36 })
  id = v4()

  @Column({
    type: 'enum',
    enum: PickupPointTypeEnum
  })
  type: PickupPointTypeEnum

  @Column()
  name: string

  @Column()
  districtName: string

  @Column()
  subjectName: string

  @Column()
  cityType: string

  @Column()
  cityName: string

  @Column()
  fullAddress: string

  @Column()
  shortAddress: string

  @Column({ type: 'varchar', nullable: true })
  phone: string | null = null

  @Column({ type: 'varchar', nullable: true })
  email: string | null = null

  @Column()
  workTime: string

  @Column({ type: 'float' })
  lat: number

  @Column({ type: 'float' })
  lon: number

  // Примечание по офису
  @Column({ type: 'varchar', nullable: true })
  note: string | null = null

  // Есть ли в офисе приём заказов
  @Column({ default: false })
  isReception: boolean = false

  // Наличие примерочной
  @Column({ default: false })
  isDressingRoom: boolean = false

  // Разрешен наложенный платеж
  @Column({ default: false })
  allowedCod: boolean = false

  // Есть прием наличных
  @Column({ default: false })
  haveCash: boolean = false

  // Наличие терминала оплаты
  @Column({ default: false })
  haveCashless: boolean = false
}

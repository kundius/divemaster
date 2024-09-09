import { EntityManager, EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { City } from '../entities/city.entity'
import { PickupPoint } from '../entities/pickup-point.entity'

type DataCities = {
  coords: {
    lat: string
    lon: string
  }
  district: string
  name: string
  population: number
  subject: string
}[]

@Injectable()
export class CityService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(City)
    private cityRepository: EntityRepository<City>,
    @InjectRepository(PickupPoint)
    private pickupPointRepository: EntityRepository<PickupPoint>,
    private configService: ConfigService
  ) {}

  async findAll() {
    return this.cityRepository.findAll()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sync() {
    const citiesContent = readFileSync(
      join(this.configService.get('LOCAL_DATA_PATH', ''), 'cities.json'),
      'utf8'
    )
    const cities = JSON.parse(citiesContent) as DataCities

    // удалить все города
    this.em.remove(await this.cityRepository.findAll())

    // добавить города из файла
    let count1 = 0
    for (const city of cities) {
      this.em.persist(
        this.cityRepository.create({
          name: city.name,
          type: 'город',
          lat: Number(city.coords.lat),
          lon: Number(city.coords.lon),
          subject: city.subject,
          district: city.district
        })
      )
      count1++
    }
    await this.em.flush()

    // добавить к городам населенные пункты, в которых есть ПВЗ
    let count2 = 0
    const points = await this.pickupPointRepository.findAll()
    const tmpAdded: string[] = []
    for (const point of points) {
      const tmpKey = `${point.subjectName}/${point.cityName}`
      if (
        !cities.find(
          (item) => item.subject === point.subjectName && item.name === point.cityName
        ) &&
        !tmpAdded.includes(tmpKey)
      ) {
        tmpAdded.push(tmpKey)
        this.em.persist(
          this.cityRepository.create({
            name: point.cityName,
            type: point.cityType,
            lat: Number(point.lat),
            lon: Number(point.lon),
            subject: point.subjectName,
            district: point.districtName
          })
        )
        count2++
      }
    }
    await this.em.flush()

    console.log('Добавлено основных:', count1)
    console.log('Добавлено дополнительных:', count2)
  }
}

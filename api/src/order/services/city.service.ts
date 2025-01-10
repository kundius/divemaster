import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { v4 } from 'uuid'
import { City } from '../entities/city.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(PickupPoint)
    private pickupPointRepository: Repository<PickupPoint>,
    private configService: ConfigService
  ) {}

  async findAll() {
    return this.cityRepository.find()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sync() {
    const citiesContent = readFileSync(
      join(this.configService.get('LOCAL_DATA_PATH', ''), 'cities.json'),
      'utf8'
    )
    const cities = JSON.parse(citiesContent) as DataCities

    // удалить все города
    await this.cityRepository.delete({})

    // добавить города из файла
    let count1 = 0
    for (const city of cities) {
      const record = new City()
      ;(record.name = city.name),
        (record.type = 'город'),
        (record.lat = Number(city.coords.lat)),
        (record.lon = Number(city.coords.lon)),
        (record.subject = city.subject),
        (record.district = city.district)
      await this.cityRepository.save(record)
      count1++
    }

    // добавить к городам населенные пункты, в которых есть ПВЗ
    let count2 = 0
    const points = await this.pickupPointRepository.find()
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
        const record = new City()
        ;(record.name = point.cityName),
          (record.type = point.cityType),
          (record.lat = Number(point.lat)),
          (record.lon = Number(point.lon)),
          (record.subject = point.subjectName),
          (record.district = point.districtName)
        await this.cityRepository.save(record)
        count2++
      }
    }

    console.log('Добавлено основных:', count1)
    console.log('Добавлено дополнительных:', count2)
  }
}

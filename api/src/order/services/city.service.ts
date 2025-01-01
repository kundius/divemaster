import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PrismaService } from '@/prisma.service'
import { v4 } from 'uuid'

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
    private readonly prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async findAll() {
    return this.prismaService.city.findMany()
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sync() {
    const citiesContent = readFileSync(
      join(this.configService.get('LOCAL_DATA_PATH', ''), 'cities.json'),
      'utf8'
    )
    const cities = JSON.parse(citiesContent) as DataCities

    // удалить все города
    await this.prismaService.city.deleteMany()

    // добавить города из файла
    let count1 = 0
    for (const city of cities) {
      await this.prismaService.city.create({
        data: {
          id: v4(),
          name: city.name,
          type: 'город',
          lat: Number(city.coords.lat),
          lon: Number(city.coords.lon),
          subject: city.subject,
          district: city.district
        }
      })
      count1++
    }

    // добавить к городам населенные пункты, в которых есть ПВЗ
    let count2 = 0
    const points = await this.prismaService.pickupPoint.findMany()
    const tmpAdded: string[] = []
    for (const point of points) {
      const tmpKey = `${point.subject_name}/${point.city_name}`
      if (
        !cities.find(
          (item) => item.subject === point.subject_name && item.name === point.city_name
        ) &&
        !tmpAdded.includes(tmpKey)
      ) {
        tmpAdded.push(tmpKey)
        await this.prismaService.city.create({
          data: {
            id: v4(),
            name: point.city_name,
            type: point.city_type,
            lat: Number(point.lat),
            lon: Number(point.lon),
            subject: point.subject_name,
            district: point.district_name
          }
        })
        count2++
      }
    }

    console.log('Добавлено основных:', count1)
    console.log('Добавлено дополнительных:', count2)
  }
}

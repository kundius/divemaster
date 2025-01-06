import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron, CronExpression } from '@nestjs/schedule'
import { $Enums, PickupPoint, Prisma } from '@prisma/client'
import fetch from 'node-fetch'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { v4 } from 'uuid'
import { FindAllPickupPointQueryDto } from '../dto/pickup-point.dto'

type DataSubjects = {
  district: string
  name: string
}[]

interface ServicePointsResult {
  _links: {
    self: {
      href: string
    }
    first: {
      href: string
    }
    last: {
      href: string
    }
    prev?: {
      href: string
    }
    next?: {
      href: string
    }
  }
  _embedded: {
    servicePoints: {
      type: string
      name: string
      extId: string
      geo: string
      limits: string
      rawAddress: string
      rawPhone: string
      rawTimetable: string
      rawDescription: string
      id: number
      state: string
      raw?: {
        city: string
        code: string
        name: string
        note: string
        type: string
        email: string
        phone: string
        coordX: string
        coordY: string
        status: string
        address: string
        cityCode: string
        fiasGuid: string
        haveCash: boolean
        takeOnly: boolean
        workTime: string
        isHandout: boolean
        ownerCode: string
        allowedCod: boolean
        postalCode: string
        regionCode: string
        regionName: string
        countryCode: string
        countryName: string
        fulfillment: boolean
        fullAddress: string
        isReception: boolean
        haveCashless: boolean
        addressComment: string
        countryCodeIso: string
        isDressingRoom: boolean
        nearestStation: string
      }
      _embedded: {
        locality?: {
          name: string
          type: string
        }
      }
    }[]
  }
}

@Injectable()
export class PickupPointService {
  constructor(
    private readonly prismaService: PrismaService,
    private configService: ConfigService
  ) {}

  async findOne(id: string): Promise<PickupPoint | null> {
    return this.prismaService.pickupPoint.findUnique({ where: { id } })
  }

  async findAll(dto: FindAllPickupPointQueryDto) {
    const where: Prisma.PickupPointWhereInput = {}

    if (dto.subject) {
      where.subjectName = { equals: dto.subject }
    }

    return this.prismaService.pickupPoint.groupBy({
      where,
      by: 'shortAddress'
    })
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async sync() {
    const subjectsContent = readFileSync(
      join(this.configService.get('LOCAL_DATA_PATH', ''), 'subjects.json'),
      'utf8'
    )
    const subjects = JSON.parse(subjectsContent) as DataSubjects

    const baseUrl = 'https://cdek.orderadmin.ru/api/delivery-services/service-points'
    const sdekFilter = 'filter[1][type]=eq&filter[1][field]=deliveryService&filter[1][value]=1' // только пункты выдачи сдэк
    const countryFilter = 'filter[2][type]=eq&filter[2][field]=country&filter[2][value]=28' // только по России
    const activeFilter = 'filter[3][type]=eq&filter[3][field]=state&filter[3][value]=active' // только активные

    await this.prismaService.pickupPoint.deleteMany({
      where: {
        type: $Enums.PickupPointType.cdek
      }
    })

    let count = 0
    let repeat = 0
    const load = async (url: string) => {
      try {
        const result = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })
        const json = (await result.json()) as ServicePointsResult

        for (const item of json._embedded.servicePoints) {
          // если населенный пункт не указан- пропускаем
          // пытаться получить название из других полей думаю не стоит
          const locality = item._embedded.locality
          if (!locality) continue

          // если нет дополнительных данных- пропускаем
          const raw = item.raw
          if (!raw) continue

          // если регион не найден- пропускаем
          const subject = subjects.find((subject) => subject.name === raw.regionName)
          if (!subject) {
            console.log('Не найден регион:', raw.regionName)
            continue
          }

          await this.prismaService.pickupPoint.create({
            data: {
              id: v4(),
              type: $Enums.PickupPointType.cdek,

              // регион из базы регионов
              districtName: subject.district,
              subjectName: subject.name,

              // поля города
              cityType: locality.type.toLowerCase(),
              cityName: locality.name,

              // необязательные поля
              email: raw.email,
              note: raw.note,
              phone: raw.phone,

              // булевые поля
              allowedCod: raw.allowedCod,
              haveCash: raw.haveCash,
              haveCashless: raw.haveCashless,
              isDressingRoom: raw.isDressingRoom,
              isReception: raw.isReception,

              // остальное
              name: raw.name,
              lat: Number(raw.coordY),
              lon: Number(raw.coordX),
              fullAddress: raw.fullAddress,
              shortAddress: raw.address,
              workTime: raw.workTime
            }
          })
          count++
        }

        repeat = 0

        if (json._links.next) {
          await load(json._links.next.href)
        }
      } catch (e) {
        repeat++
        if (repeat > 10) {
          throw e
        }
        console.log('Повторное подключение. Попытка:', repeat)
        await load(url)
      }
    }

    await load(`${baseUrl}?${sdekFilter}&${countryFilter}&${activeFilter}`)

    console.log('Добавлено:', count)
  }
}

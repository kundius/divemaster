import { EntityManager, EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import fetch from 'node-fetch'
import { PickupPoint } from '../entities/pickup-point.entity'
import { FindAllPickupPointQueryDto } from '../dto/pickup-point.dto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ConfigService } from '@nestjs/config'

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
    }[]
  }
}

type CitiesResult = {
  name: string
  id: string
  region: {
    name: string
    fullname: string
    district: string
  }
}[]

@Injectable()
export class PickupPointService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(PickupPoint)
    private pickupPointRepository: EntityRepository<PickupPoint>,
    private configService: ConfigService
  ) {}

  async findAll(dto: FindAllPickupPointQueryDto) {
    let where: ObjectQuery<PickupPoint> = {}
    if (dto.region) {
      where = { ...where, regionName: dto.region }
    }
    return await this.pickupPointRepository.find(where, {
      groupBy: 'address'
    })
  }

  async cities() {
    const data = readFileSync(
      join(this.configService.get('LOCAL_STORAGE_PATH', ''), 'russia-cities.json'),
      'utf8'
    )
    const rows = JSON.parse(data) as CitiesResult
    const districts = new Map<string, { name: string; id: number }>()
    const regions = new Map<
      string,
      { name: string; fullname: string; id: number; districtId: number }
    >()
    const cities = new Map<string, { name: string; id: string; regionId: number }>()

    for (const row of rows) {
      let district = districts.get(row.region.district)
      if (!district) {
        district = {
          id: districts.size + 1,
          name: row.region.district
        }
        districts.set(row.region.district, district)
      }

      let region = regions.get(row.region.fullname)
      if (!region) {
        region = {
          id: regions.size + 1,
          fullname: row.region.fullname,
          name: row.region.name,
          districtId: district.id
        }
        regions.set(row.region.fullname, region)
      }

      cities.set(row.name, {
        id: row.id,
        name: row.name,
        regionId: region.id
      })
    }

    return {
      districts: Array.from(districts.values()),
      regions: Array.from(regions.values()),
      cities: Array.from(cities.values())
    }
    // const rows = JSON.parse(data) as CitiesResult
    // const output: Record<string, Record<string, string[]>> = {}

    // for (const row of rows) {
    //   if (!output[row.region.district]) {
    //     output[row.region.district] = {}
    //   }
    //   if (!output[row.region.district][row.region.fullname]) {
    //     output[row.region.district][row.region.fullname] = []
    //   }
    //   output[row.region.district][row.region.fullname].push(row.name)
    // }

    // return output
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncPickupPoints() {
    const baseUrl = 'https://cdek.orderadmin.ru/api/delivery-services/service-points'
    const sdekFilter = 'filter[1][type]=eq&filter[1][field]=deliveryService&filter[1][value]=1' // только пункты выдачи сдэк
    const countryFilter = 'filter[2][type]=eq&filter[2][field]=country&filter[2][value]=28' // только по России
    const activeFilter = 'filter[3][type]=eq&filter[3][field]=state&filter[3][value]=active' // только активные

    this.em.remove(await this.pickupPointRepository.findAll())

    const load = async (url: string) => {
      const result = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
      const json = (await result.json()) as ServicePointsResult

      for (const item of json._embedded.servicePoints) {
        this.em.persist(
          this.pickupPointRepository.create({
            name: item.raw?.name || '',
            lat: item.raw?.coordY || '',
            lon: item.raw?.coordX || '',
            fullAddress: item.raw?.fullAddress || '',
            address: item.raw?.address || '',
            email: item.raw?.email || '',
            allowedCod: item.raw?.allowedCod || false,
            haveCash: item.raw?.haveCash || false,
            haveCashless: item.raw?.haveCashless || false,
            isDressingRoom: item.raw?.isDressingRoom || false,
            isReception: item.raw?.isReception || false,
            note: item.raw?.note || '',
            phone: item.raw?.phone || '',
            regionCode: item.raw?.regionCode || '',
            regionName: item.raw?.regionName || '',
            cityCode: item.raw?.cityCode || '',
            cityName: item.raw?.city || '',
            workTime: item.raw?.workTime || ''
          })
        )
      }

      if (json._links.next) {
        await load(json._links.next.href)
      }
    }

    await load(`${baseUrl}?${sdekFilter}&${countryFilter}&${activeFilter}`)

    await this.em.flush()
  }
}

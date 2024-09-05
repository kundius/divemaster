import { EntityManager, EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import fetch from 'node-fetch'
import { PickupPoint } from '../entities/pickup-point.entity'
import { FindAllPickupPointQueryDto } from '../dto/pickup-point.dto'

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

@Injectable()
export class PickupPointService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(PickupPoint)
    private pickupPointRepository: EntityRepository<PickupPoint>
  ) {}

  async findAll(dto: FindAllPickupPointQueryDto) {
    let where: ObjectQuery<PickupPoint> = {}
    if (dto.region) {
      where = { ...where, region: dto.region }
    }
    return await this.pickupPointRepository.find(where)
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async syncPickupPoints() {
    const baseUrl = 'https://cdek.orderadmin.ru/api/delivery-services/service-points'
    const sdekFilter = 'filter[1][type]=eq&filter[1][field]=deliveryService&filter[1][value]=1' // только пункты выдачи сдэк
    const countryFilter = 'filter[2][type]=eq&filter[2][field]=country&filter[2][value]=28' // только по России
    const activeFilter = 'filter[3][type]=eq&filter[3][field]=state&filter[3][value]=active' // только активные

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }

    this.em.remove(await this.pickupPointRepository.findAll())

    let idx = 0
    const load = async (url: string) => {
      const result = await fetch(url, options)
      const json = (await result.json()) as ServicePointsResult

      for (const item of json._embedded.servicePoints) {
        this.em.persist(
          this.pickupPointRepository.create({
            address: item.rawAddress || '',
            email: item.raw?.email || '',
            allowedCod: item.raw?.allowedCod || false,
            haveCash: item.raw?.haveCash || false,
            haveCashless: item.raw?.haveCashless || false,
            isDressingRoom: item.raw?.isDressingRoom || false,
            isReception: item.raw?.isReception || false,
            note: item.raw?.note || '',
            phone: item.rawPhone || '',
            region: item.raw?.regionName || '',
            timetable: item.rawTimetable || ''
          })
        )
        idx++
      }

      if (json._links.next) {
        await load(json._links.next.href)
      }
    }

    await load(`${baseUrl}?${sdekFilter}&${countryFilter}&${activeFilter}`)

    await this.em.flush()
  }
}

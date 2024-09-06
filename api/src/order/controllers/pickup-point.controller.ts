import { Controller, Get, Post, Query } from '@nestjs/common'
import { PickupPointService } from '../services/pickup-point.service'
import { FindAllPickupPointQueryDto } from '../dto/pickup-point.dto'

@Controller('pickup-point')
export class PickupPointController {
  constructor(private readonly pickupPointService: PickupPointService) {}

  @Get('sync')
  sync() {
    return this.pickupPointService.syncPickupPoints()
  }

  @Get()
  findAll(@Query() query: FindAllPickupPointQueryDto) {
    return this.pickupPointService.findAll(query)
  }
}

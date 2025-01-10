import { Controller, Get, Query } from '@nestjs/common'
import { FindAllPickupPointQueryDto } from '../dto/pickup-point.dto'
import { PickupPointService } from '../services/pickup-point.service'

@Controller('pickup-point')
export class PickupPointController {
  constructor(private readonly pickupPointService: PickupPointService) {}

  @Get('sync')
  sync() {
    return this.pickupPointService.sync()
  }

  @Get()
  findAll(@Query() query: FindAllPickupPointQueryDto) {
    return this.pickupPointService.findAll(query)
  }
}

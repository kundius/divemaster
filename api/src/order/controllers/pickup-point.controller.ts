import { Controller, Get, Param, Query } from '@nestjs/common'
import { FindAllPickupPointQueryDto } from '../dto/pickup-point.dto'
import { PickupPointService } from '../services/pickup-point.service'

@Controller('pickup-point')
export class PickupPointController {
  constructor(private readonly pickupPointService: PickupPointService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pickupPointService.findOne(id)
  }

  @Get('sync')
  sync() {
    return this.pickupPointService.sync()
  }

  @Get()
  findAll(@Query() query: FindAllPickupPointQueryDto) {
    return this.pickupPointService.findAll(query)
  }
}

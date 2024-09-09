import { Controller, Get } from '@nestjs/common'
import { CityService } from '../services/city.service'

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get('sync')
  sync() {
    return this.cityService.sync()
  }

  @Get()
  findAll() {
    return this.cityService.findAll()
  }
}

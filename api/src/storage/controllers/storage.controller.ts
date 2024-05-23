import { Controller, Get } from '@nestjs/common'
import { StorageService } from '../services/storage.service'

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  getHello(): string {
    return this.storageService.getHello()
  }
}

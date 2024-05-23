import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { StorageService } from '../services/storage.service'

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Get(':id/read')
  async read(@Param('id') id: string, @Res() res: Response) {
    const file = await this.storageService.findOne(+id)

    if (!file) {
      throw new NotFoundException()
    }

    const stream = await this.storageService.stream(file)

    if (!stream) {
      throw new NotFoundException()
    }

    res.set({ 'Content-Type': file.type })

    stream.pipe(res)
  }
}

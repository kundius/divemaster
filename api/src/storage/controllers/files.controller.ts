import { Controller, Get, Param } from '@nestjs/common'
import { FilesService } from '../services/files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id)
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { SyncService } from '../services/sync.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { extname } from 'path'

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  // @Get()
  // findAll(@Query() query: FindAllBrandQueryDto) {
  //   return this.brandsService.findAll(query)
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.brandsService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
  //   return this.brandsService.update(+id, dto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.brandsService.remove(+id)
  // }
}

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { FindAllSyncTaskDto } from '../dto/sync.dto'
import { SyncService } from '../services/sync.service'
import { tmpdir } from 'os'

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('task')
  findAllTask(@Query() query: FindAllSyncTaskDto) {
    return this.syncService.findAllTask(query)
  }

  @Post('task')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: tmpdir()
      })
    })
  )
  createTask(@UploadedFile() upload: Express.Multer.File) {
    return this.syncService.createTask(upload)
  }

  @Delete('task/:id')
  removeTask(@Param('id') id: string) {
    return this.syncService.removeTask(+id)
  }
}

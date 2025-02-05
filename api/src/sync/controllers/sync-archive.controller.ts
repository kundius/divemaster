import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { SyncArchiveService } from '../services/sync-archive.service'

@Controller('sync/archive')
export class SyncArchiveController {
  constructor(private readonly syncArchiveService: SyncArchiveService) {}

  @Post('create-task')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({})
    })
  )
  createTaskFromArchive(@UploadedFile() upload: Express.Multer.File) {
    return this.syncArchiveService.createTask(upload)
  }
}

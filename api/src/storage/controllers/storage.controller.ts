import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { nanoid } from '@/lib/utils'
import { User } from '@/users/entities/user.entity'
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { diskStorage } from 'multer'
import { unlink } from 'node:fs/promises'
import { StorageService } from '../services/storage.service'

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({})
    })
  )
  async upload(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() currentUser?: User
  ) {
    if (!currentUser) {
      throw new ForbiddenException()
    }

    const file = files[0]
    if (!file) {
      throw new BadRequestException()
    }

    const date = new Date()
    const name = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const path = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${nanoid()}-${name}`
    const fileEntity = await this.storageService.upload(file, path)
    await unlink(file.path)

    return fileEntity
  }

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

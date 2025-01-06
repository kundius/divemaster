import { Module } from '@nestjs/common'
import { FilesController } from './controllers/files.controller'
import { StorageController } from './controllers/storage.controller'
import { FilesService } from './services/files.service'
import { StorageService } from './services/storage.service'
import { PrismaService } from '@/prisma.service'

@Module({
  controllers: [StorageController, FilesController],
  providers: [StorageService, FilesService, PrismaService],
  exports: [StorageService]
})
export class StorageModule {}

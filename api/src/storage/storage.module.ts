import { Module } from '@nestjs/common'
import { FilesController } from './controllers/files.controller'
import { StorageController } from './controllers/storage.controller'
import { FilesService } from './services/files.service'
import { StorageService } from './services/storage.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { File } from './entities/file.entity'

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [StorageController, FilesController],
  providers: [StorageService, FilesService],
  exports: [StorageService]
})
export class StorageModule {}

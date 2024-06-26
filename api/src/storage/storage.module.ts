import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { FilesController } from './controllers/files.controller'
import { StorageController } from './controllers/storage.controller'
import { File } from './entities/file.entity'
import { FilesService } from './services/files.service'
import { StorageService } from './services/storage.service'

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  controllers: [StorageController, FilesController],
  providers: [StorageService, FilesService],
  exports: [StorageService]
})
export class StorageModule {}

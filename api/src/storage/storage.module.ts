import { Module } from '@nestjs/common'
import { StorageController } from './controllers/storage.controller'
import { File } from './entities/file.entity'
import { StorageService } from './services/storage.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService]
})
export class StorageModule {}

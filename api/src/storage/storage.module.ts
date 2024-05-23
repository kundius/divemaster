import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StorageController } from './controllers/storage.controller'
import { StorageService } from './services/storage.service'

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService]
})
export class StorageModule {}

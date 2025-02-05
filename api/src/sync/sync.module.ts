import { StorageModule } from '@/storage/storage.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SyncProduct } from './entities/sync-product.entity'
import { SyncTask } from './entities/sync-task.entity'
import { SyncController } from './controllers/sync.controller'
import { SyncService } from './services/sync.service'
import { SyncArchiveService } from './services/sync-archive.service'
import { SyncArchiveController } from './controllers/sync-archive.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SyncTask, SyncProduct]), StorageModule],
  controllers: [SyncController, SyncArchiveController],
  providers: [SyncService, SyncArchiveService]
})
export class SyncModule {}

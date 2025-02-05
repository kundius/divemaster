import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SyncTask, SyncTaskProvider, SyncTaskStatus } from '../entities/sync-task.entity'
import { SyncProduct } from '../entities/sync-product.entity'
import { Cron, CronExpression } from '@nestjs/schedule'
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { extname, join } from 'path'

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(SyncTask)
    private syncTaskRepository: Repository<SyncTask>,
    @InjectRepository(SyncProduct)
    private syncProductRepository: Repository<SyncProduct>
  ) {}

}

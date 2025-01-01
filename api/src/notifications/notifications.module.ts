import { Module } from '@nestjs/common'

import { NotificationsService } from './services/notifications.service'
import { PrismaService } from '@/prisma.service'

@Module({
  providers: [NotificationsService, PrismaService],
  exports: [NotificationsService]
})
export class NotificationsModule {}

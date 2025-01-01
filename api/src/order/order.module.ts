import { NotificationsModule } from '@/notifications/notifications.module'
import { Module } from '@nestjs/common'
import { CityController } from './controllers/city.controller'
import { OrderController } from './controllers/order.controller'
import { PickupPointController } from './controllers/pickup-point.controller'
import { CityService } from './services/city.service'
import { OrderService } from './services/order.service'
import { PickupPointService } from './services/pickup-point.service'
import { UponCashService } from './services/uponcash.service'
import { YookassaService } from './services/yookassa.service'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [NotificationsModule],
  providers: [
    OrderService,
    PickupPointService,
    CityService,
    YookassaService,
    UponCashService,
    PrismaService
  ],
  controllers: [OrderController, PickupPointController, CityController],
  exports: [OrderService, PickupPointService, CityService, YookassaService, UponCashService]
})
export class OrderModule {}

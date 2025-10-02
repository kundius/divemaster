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
import { TypeOrmModule } from '@nestjs/typeorm'
import { City } from './entities/city.entity'
import { Order } from './entities/order.entity'
import { Delivery } from './entities/delivery.entity'
import { Payment } from './entities/payment.entity'
import { OrderProduct } from './entities/order-product.entity'
import { PickupPoint } from './entities/pickup-point.entity'
import { AuthModule } from '@/auth/auth.module'
import { VtbService } from './services/vtb.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([City, Order, Delivery, Payment, OrderProduct, PickupPoint]),
    NotificationsModule,
    AuthModule
  ],
  providers: [
    OrderService,
    PickupPointService,
    CityService,
    YookassaService,
    UponCashService,
    VtbService
  ],
  controllers: [OrderController, PickupPointController, CityController],
  exports: [
    OrderService,
    PickupPointService,
    CityService,
    YookassaService,
    UponCashService,
    VtbService
  ]
})
export class OrderModule {}

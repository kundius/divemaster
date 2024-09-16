import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { NotificationsModule } from '@/notifications/notifications.module'
import { Product } from '@/products/entities/product.entity'

import { CityController } from './controllers/city.controller'
import { OrderController } from './controllers/order.controller'
import { PickupPointController } from './controllers/pickup-point.controller'
import { City } from './entities/city.entity'
import { Delivery } from './entities/delivery.entity'
import { OrderProduct } from './entities/order-product.entity'
import { Order } from './entities/order.entity'
import { Payment } from './entities/payment.entity'
import { PickupPoint } from './entities/pickup-point.entity'
import { CityService } from './services/city.service'
import { OrderService } from './services/order.service'
import { PickupPointService } from './services/pickup-point.service'
import { UponCashService } from './services/uponcash.service'
import { YookassaService } from './services/yookassa.service'

@Module({
  imports: [
    NotificationsModule,
    MikroOrmModule.forFeature([Order, OrderProduct, Product, PickupPoint, City, Payment, Delivery])
  ],
  providers: [OrderService, PickupPointService, CityService, YookassaService, UponCashService],
  controllers: [OrderController, PickupPointController, CityController],
  exports: [OrderService, PickupPointService, CityService, YookassaService, UponCashService]
})
export class OrderModule {}

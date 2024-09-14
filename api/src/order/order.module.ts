import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { Product } from '@/products/entities/product.entity'

import { CityController } from './controllers/city.controller'
import { OrderController } from './controllers/order.controller'
import { PickupPointController } from './controllers/pickup-point.controller'
import { City } from './entities/city.entity'
import { OrderProduct } from './entities/order-product.entity'
import { Order } from './entities/order.entity'
import { PickupPoint } from './entities/pickup-point.entity'
import { CityService } from './services/city.service'
import { OrderService } from './services/order.service'
import { PickupPointService } from './services/pickup-point.service'
import { YookassaService } from './services/yookassa.service'
import { UponCashService } from './services/uponcash.service'

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderProduct, Product, PickupPoint, City])],
  providers: [OrderService, PickupPointService, CityService, YookassaService, UponCashService],
  controllers: [OrderController, PickupPointController, CityController],
  exports: [OrderService, PickupPointService, CityService, YookassaService, UponCashService]
})
export class OrderModule {}

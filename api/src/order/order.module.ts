import { Product } from '@/products/entities/product.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { Order } from './entities/order.entity'
import { OrderProduct } from './entities/order-product.entity'
import { OrderService } from './services/order.service'
import { OrderController } from './controllers/order.controller'
import { PickupPoint } from './entities/pickup-point.entity'
import { PickupPointService } from './services/pickup-point.service'
import { PickupPointController } from './controllers/pickup-point.controller'

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderProduct, Product, PickupPoint])],
  providers: [OrderService, PickupPointService],
  controllers: [OrderController, PickupPointController],
  exports: [OrderService, PickupPointService]
})
export class OrderModule {}

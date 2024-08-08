import { Product } from '@/products/entities/product.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { Order } from './entities/order.entity'
import { OrderProduct } from './entities/order-product.entity'
import { OrderService } from './services/order.service'
import { OrderController } from './controllers/order.controller'

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderProduct, Product])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}

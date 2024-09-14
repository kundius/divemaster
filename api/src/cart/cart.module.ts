import { NotificationsModule } from '@/notifications/notifications.module'
import { Delivery } from '@/order/entities/delivery.entity'
import { OrderProduct } from '@/order/entities/order-product.entity'
import { Order } from '@/order/entities/order.entity'
import { Payment } from '@/order/entities/payment.entity'
import { Product } from '@/products/entities/product.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { CartController } from './controllers/cart.controller'
import { CartProduct } from './entities/cart-product.entity'
import { Cart } from './entities/cart.entity'
import { CartService } from './services/cart.service'
import { OrderModule } from '@/order/order.module'

@Module({
  imports: [
    NotificationsModule,
    OrderModule,
    MikroOrmModule.forFeature([Cart, CartProduct, Product, Order, OrderProduct, Delivery, Payment])
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}

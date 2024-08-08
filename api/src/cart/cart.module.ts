import { Product } from '@/products/entities/product.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CartController } from './controllers/cart.controller'
import { CartProduct } from './entities/cart-product.entity'
import { Cart } from './entities/cart.entity'
import { CartService } from './services/cart.service'
import { Order } from '@/order/entities/order.entity'
import { OrderProduct } from '@/order/entities/order-product.entity'
import { NotificationsModule } from '@/notifications/notifications.module'

@Module({
  imports: [
    NotificationsModule,
    MikroOrmModule.forFeature([Cart, CartProduct, Product, Order, OrderProduct])
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}

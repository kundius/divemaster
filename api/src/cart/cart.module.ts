import { Module } from '@nestjs/common'
import { CartController } from './controllers/cart.controller'
import { CartService } from './services/cart.service'
import { OrderModule } from '@/order/order.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Cart } from './entities/cart.entity'
import { CartProduct } from './entities/cart-product.entity'
import { OptionValue } from '@/products/entities/option-value.entity'
import { Order } from '@/order/entities/order.entity'
import { Payment } from '@/order/entities/payment.entity'
import { Delivery } from '@/order/entities/delivery.entity'
import { OrderProduct } from '@/order/entities/order-product.entity'
import { CartProductOption } from './entities/cart-product-option.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartProduct,
      CartProductOption,
      OptionValue,
      Order,
      Payment,
      Delivery,
      OrderProduct
    ]),
    OrderModule
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}

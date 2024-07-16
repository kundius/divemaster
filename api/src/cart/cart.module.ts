import { Product } from '@/products/entities/product.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { CartController } from './controllers/cart.controller'
import { CartProduct } from './entities/cart-product.entity'
import { Cart } from './entities/cart.entity'
import { CartService } from './services/cart.service'

@Module({
  imports: [MikroOrmModule.forFeature([Cart, CartProduct, Product])],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}

import { Product } from '@/products/entities/product.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WishlistController } from './controllers/wishlist.controller'
import { Wishlist } from './entities/wishlist.entity'
import { WishlistService } from './services/wishlist.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Wishlist,
      Product
    ]),
  ],
  providers: [WishlistService],
  controllers: [WishlistController],
  exports: [WishlistService]
})
export class WishlistModule {}

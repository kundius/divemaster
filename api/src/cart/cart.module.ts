import { Module } from '@nestjs/common'
import { CartController } from './controllers/cart.controller'
import { CartService } from './services/cart.service'
import { OrderModule } from '@/order/order.module'
import { PrismaService } from '@/prisma.service'

@Module({
  imports: [OrderModule],
  providers: [CartService, PrismaService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}

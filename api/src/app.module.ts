import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import configuration from './config/configuration'
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { OrderModule } from './order/order.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ScheduleModule } from '@nestjs/schedule'
import { BlogModule } from './blog/blog.module'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    UsersModule,
    AuthModule,
    ProductsModule,
    StorageModule,
    CartModule,
    OrderModule,
    NotificationsModule,
    BlogModule
  ],
  providers: [AppService]
})
export class AppModule {}

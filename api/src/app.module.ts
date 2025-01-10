import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { BlogModule } from './blog/blog.module'
import { CartModule } from './cart/cart.module'
import databaseConfig from './config/database.config'
import mainConfig from './config/main.config'
import { NotificationsModule } from './notifications/notifications.module'
import { OrderModule } from './order/order.module'
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, load: [mainConfig] }),
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

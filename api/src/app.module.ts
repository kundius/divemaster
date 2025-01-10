import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CartModule } from './cart/cart.module'
import mainConfig from './config/main.config'
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { OrderModule } from './order/order.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ScheduleModule } from '@nestjs/schedule'
import { BlogModule } from './blog/blog.module'
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      name: 'divemaster',
      username: 'divemaster',
      password: 'divemaster',
      autoLoadEntities: true,
      synchronize: false,
      debug: false
    }),
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

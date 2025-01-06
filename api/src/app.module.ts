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
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env['DATABASE_HOST'],
    //   port: 3306,
    //   username: process.env['DATABASE_USER'],
    //   password: process.env['DATABASE_PASSWORD'],
    //   database: process.env['DATABASE_NAME'],
    //   entities: [],
    //   synchronize: false,
    // }),
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

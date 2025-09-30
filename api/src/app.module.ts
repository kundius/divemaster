import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { BlogModule } from './blog/blog.module'
import { CartModule } from './cart/cart.module'
import mainConfig from './config/main.config'
import { NotificationsModule } from './notifications/notifications.module'
import { OrderModule } from './order/order.module'
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { SyncModule } from './sync/sync.module'
import { AppDataSource } from 'db/ormconfig'
import { WishlistModule } from './wishlist/wishlist.module'
import { TypesenseModule } from './typesense/typesense.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...AppDataSource.options
      })
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
    BlogModule,
    SyncModule,
    WishlistModule,
    TypesenseModule
  ],
  providers: [AppService]
})
export class AppModule {}

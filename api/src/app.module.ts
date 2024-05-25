import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import configuration from './config/configuration'
import mikroOrmConfig from './db/mikro-orm.config' // your ORM config
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    UsersModule,
    AuthModule,
    ProductsModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

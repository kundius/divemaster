import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import configuration from './config/configuration'
import { dataSourceOptions } from './db/ormconfig'
import { ProductsModule } from './products/products.module'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
      })
    }),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    AuthModule,
    ProductsModule,
    StorageModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

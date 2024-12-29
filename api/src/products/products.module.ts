import { NotificationsModule } from '@/notifications/notifications.module'
import { PrismaService } from '@/prisma.service'
import { StorageModule } from '@/storage/storage.module'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { CategoriesController } from './controllers/categories.controller'
import { OptionsController } from './controllers/options.controller'
import { ProductsController } from './controllers/products.controller'
import { BrandsService } from './services/brands.service'
import { CategoriesService } from './services/categories.service'
import { OptionsService } from './services/options.service'
import { ProductsFilterService } from './services/products-filter.service'
import { ProductsService } from './services/products.service'

@Module({
  imports: [NotificationsModule, StorageModule],
  controllers: [ProductsController, CategoriesController, BrandsController, OptionsController],
  providers: [
    ProductsService,
    CategoriesService,
    BrandsService,
    OptionsService,
    ProductsFilterService,
    PrismaService
  ]
})
export class ProductsModule {}

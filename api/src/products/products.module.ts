import { StorageModule } from '@/storage/storage.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { CategoriesController } from './controllers/categories.controller'
import { OptionsController } from './controllers/options.controller'
import { ProductsController } from './controllers/products.controller'
import { Brand } from './entities/brand.entity'
import { Category } from './entities/category.entity'
import { OptionValue } from './entities/option-value.entity'
import { Option } from './entities/option.entity'
import { ProductImage } from './entities/product-image.entity'
import { Product } from './entities/product.entity'
import { BrandsService } from './services/brands.service'
import { CategoriesService } from './services/categories.service'
import { OptionsService } from './services/options.service'
import { ProductsService } from './services/products.service'
import { ProductsFilterService } from './services/products-filter.service'
import { Offer } from './entities/offer.entity'
import { NotificationsModule } from '@/notifications/notifications.module'

@Module({
  imports: [
    NotificationsModule,
    MikroOrmModule.forFeature([Category, Product, ProductImage, Brand, Option, OptionValue, Offer]),
    StorageModule
  ],
  controllers: [ProductsController, CategoriesController, BrandsController, OptionsController],
  providers: [
    ProductsService,
    CategoriesService,
    BrandsService,
    OptionsService,
    ProductsFilterService
  ]
})
export class ProductsModule {}

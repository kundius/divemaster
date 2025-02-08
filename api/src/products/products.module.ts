import { NotificationsModule } from '@/notifications/notifications.module'
import { StorageModule } from '@/storage/storage.module'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { CategoriesController } from './controllers/categories.controller'
import { OptionsController } from './controllers/options.controller'
import { ProductsController } from './controllers/products.controller'
import { BrandsService } from './services/brands.service'
import { CategoriesService } from './services/categories.service'
import { OptionsService } from './services/options.service'
import { ProductsService } from './services/products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { Brand } from './entities/brand.entity'
import { Offer } from './entities/offer.entity'
import { OptionValue } from './entities/option-value.entity'
import { ProductImage } from './entities/product-image.entity'
import { Product } from './entities/product.entity'
import { Option } from './entities/option.entity'
import { ProductsFilterService } from './services/products-filter.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Brand, Offer, Option, OptionValue, Product, ProductImage]),
    NotificationsModule,
    StorageModule
  ],
  controllers: [ProductsController, CategoriesController, BrandsController, OptionsController],
  exports: [ProductsService, CategoriesService],
  providers: [
    ProductsService,
    CategoriesService,
    BrandsService,
    OptionsService,
    ProductsFilterService
  ]
})
export class ProductsModule {}

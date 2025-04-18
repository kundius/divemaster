import { NotificationsModule } from '@/notifications/notifications.module'
import { StorageModule } from '@/storage/storage.module'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { CategoriesController } from './controllers/categories.controller'
import { PropertiesController } from './controllers/properties.controller'
import { ProductsController } from './controllers/products.controller'
import { BrandsService } from './services/brands.service'
import { CategoriesService } from './services/categories.service'
import { PropertiesService } from './services/properties.service'
import { ProductsService } from './services/products.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './entities/category.entity'
import { Brand } from './entities/brand.entity'
import { Offer } from './entities/offer.entity'
import { OptionValue } from './entities/option-value.entity'
import { ProductImage } from './entities/product-image.entity'
import { Product } from './entities/product.entity'
import { Property } from './entities/property.entity'
import { ProductsFilterService } from './services/products-filter.service'
import { OfferOption } from './entities/offer-option.entity'
import { ProductOption } from './entities/product-option.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Brand,
      Offer,
      OfferOption,
      Property,
      OptionValue,
      Product,
      ProductOption,
      ProductImage
    ]),
    NotificationsModule,
    StorageModule
  ],
  controllers: [ProductsController, CategoriesController, BrandsController, PropertiesController],
  exports: [ProductsService, CategoriesService],
  providers: [
    ProductsService,
    CategoriesService,
    BrandsService,
    PropertiesService,
    ProductsFilterService
  ]
})
export class ProductsModule {}

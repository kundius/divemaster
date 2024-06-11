import { StorageModule } from '@/storage/storage.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { CategoriesController } from './controllers/categories.controller'
import { OptionsController } from './controllers/options.controller'
import { ProductsController } from './controllers/products.controller'
import { Brand } from './entities/brand.entity'
import { Category } from './entities/category.entity'
import { OptionVariant } from './entities/option-variant.entity'
import { Option } from './entities/option.entity'
import { ProductImage } from './entities/product-image.entity'
import { Product } from './entities/product.entity'
import { BrandsService } from './services/brands.service'
import { CategoriesService } from './services/categories.service'
import { OptionsService } from './services/options.service'
import { ProductsService } from './services/products.service'

@Module({
  imports: [
    MikroOrmModule.forFeature([Category, Product, ProductImage, Brand, Option, OptionVariant]),
    StorageModule
  ],
  controllers: [ProductsController, CategoriesController, BrandsController, OptionsController],
  providers: [ProductsService, CategoriesService, BrandsService, OptionsService]
})
export class ProductsModule {}

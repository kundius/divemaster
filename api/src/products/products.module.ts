import { StorageModule } from '@/storage/storage.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'
import { BrandsController } from './controllers/brands.controller'
import { CategoriesController } from './controllers/categories.controller'
import { ProductsController } from './controllers/products.controller'
import { Brand } from './entities/brand.entity'
import { Category } from './entities/category.entity'
import { ProductImage } from './entities/product-image.entity'
import { Product } from './entities/product.entity'
import { BrandsService } from './services/brands.service'
import { CategoriesService } from './services/categories.service'
import { ProductsService } from './services/products.service'
import { ProductContent } from './entities/product-content.entity'

@Module({
  imports: [
    MikroOrmModule.forFeature([Category, Product, ProductImage, Brand, ProductContent]),
    StorageModule
  ],
  controllers: [ProductsController, CategoriesController, BrandsController],
  providers: [ProductsService, CategoriesService, BrandsService]
})
export class ProductsModule {}

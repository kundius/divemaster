import { Module } from '@nestjs/common'
import { CategoriesController } from './controllers/categories.controller'
import { ProductsController } from './controllers/products.controller'
import { Category } from './entities/category.entity'
import { ProductImage } from './entities/product-image.entity'
import { Product } from './entities/product.entity'
import { CategoriesService } from './services/categories.service'
import { ProductsService } from './services/products.service'
import { StorageModule } from '@/storage/storage.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'

@Module({
  imports: [MikroOrmModule.forFeature([Category, Product, ProductImage]), StorageModule],
  controllers: [ProductsController, CategoriesController],
  providers: [ProductsService, CategoriesService]
})
export class ProductsModule {}

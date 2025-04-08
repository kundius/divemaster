import { StorageModule } from '@/storage/storage.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SyncProduct } from './entities/sync-product.entity'
import { SyncTask } from './entities/sync-task.entity'
import { SyncController } from './controllers/sync.controller'
import { SyncService } from './services/sync.service'
import { ProductsModule } from '@/products/products.module'
import { Product } from '@/products/entities/product.entity'
import { ProductImage } from '@/products/entities/product-image.entity'
import { Category } from '@/products/entities/category.entity'
import { Brand } from '@/products/entities/brand.entity'
import { OptionValue } from '@/products/entities/option-value.entity'
import { Property } from '@/products/entities/property.entity'
import { Offer } from '@/products/entities/offer.entity'
import { ProductOption } from '@/products/entities/product-option.entity'
import { OfferOption } from '@/products/entities/offer-option.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SyncTask,
      SyncProduct,
      Product,
      Category,
      ProductImage,
      ProductOption,
      Brand,
      Property,
      OptionValue,
      Offer,
      OfferOption
    ]),
    StorageModule,
    ProductsModule
  ],
  controllers: [SyncController],
  providers: [SyncService]
})
export class SyncModule {}

import { Injectable } from '@nestjs/common'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { Product } from '../entities/product.entity'
import { FindAllProductQueryDto } from '../dto/find-all-product-query.dto'
import { ProductImage } from '../entities/product-image.entity'
import { StorageService } from '@/storage/services/storage.service'
import { join } from 'path'
import { nanoid } from '@/lib/utils'
import { UpdateProductImageDto } from '../dto/update-product-image.dto'
import { SortProductImageDto } from '../dto/sort-product-image.dto'
import { Category } from '../entities/category.entity'
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto'
import { EntityRepository, QueryOrder } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Brand } from '../entities/brand.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: EntityRepository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: EntityRepository<ProductImage>,
    @InjectRepository(Category)
    private categoryRepository: EntityRepository<Category>,
    @InjectRepository(Brand)
    private brandRepository: EntityRepository<Brand>,
    private storageService: StorageService
  ) {}

  async create({ brandId, ...fillable }: CreateProductDto) {
    const product = new Product()

    this.productsRepository.assign(product, fillable)

    if (typeof brandId !== 'undefined') {
      product.brand = brandId ? await this.brandRepository.findOneOrFail({ id: +brandId }) : null
    }

    await this.productsRepository.getEntityManager().persistAndFlush(product)

    return product
  }

  async findAll(query: FindAllProductQueryDto) {
    const [rows, total] = await this.productsRepository.findAndCount(query.where, query.options)
    return { rows, total }
  }

  async findOne(id: number) {
    return this.productsRepository.findOneOrFail({ id })
  }

  async update(id: number, { brandId, ...fillable }: UpdateProductDto) {
    const product = await this.findOne(id)

    this.productsRepository.assign(product, fillable)

    if (typeof brandId !== 'undefined') {
      product.brand = brandId ? await this.brandRepository.findOneOrFail({ id: +brandId }) : null
    }

    await this.productsRepository.getEntityManager().persistAndFlush(product)
  }

  async remove(id: number) {
    const product = await this.productsRepository.findOneOrFail({ id })
    await this.productsRepository.getEntityManager().removeAndFlush(product)
  }

  async createProductImage(productId: number, upload: Express.Multer.File) {
    const product = await this.productsRepository.findOneOrFail(
      { id: productId },
      {
        populate: ['images']
      }
    )

    const file = await this.storageService.upload(
      upload,
      join(String(productId), `${nanoid()}-${upload.originalname}`)
    )
    const productImage = new ProductImage()
    productImage.file = file
    productImage.product = product
    productImage.rank = product.images.length
    await this.productImageRepository.getEntityManager().persistAndFlush(productImage)
    return productImage
  }

  async findAllProductImage(productId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    return await this.productImageRepository.find(
      { product },
      {
        orderBy: {
          rank: QueryOrder.ASC
        }
      }
    )
  }

  async findOneProductImage(productId: number, fileId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    const file = await this.storageService.findOneOrFail(fileId)
    return this.productImageRepository.findOneOrFail({ product, file })
  }

  async updateProductImage(
    productId: number,
    fileId: number,
    { ...fillable }: UpdateProductImageDto
  ) {
    const productImage = await this.findOneProductImage(productId, fileId)

    this.productImageRepository.assign(productImage, fillable)

    await this.productImageRepository.getEntityManager().persistAndFlush(productImage)
  }

  async sortProductImage(productId: number, { files }: SortProductImageDto) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    for (const fileId of Object.keys(files)) {
      const file = await this.storageService.findOneOrFail(+fileId)
      const productImage = await this.productImageRepository.findOneOrFail({
        product,
        file
      })
      productImage.rank = files[fileId]
      await this.productImageRepository.getEntityManager().persist(productImage)
    }
    await this.productImageRepository.getEntityManager().flush()
  }

  async removeProductImage(productId: number, fileId: number) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    const file = await this.storageService.findOneOrFail(fileId)
    const productImage = await this.productImageRepository.findOneOrFail({ product, file })
    await this.productImageRepository.getEntityManager().removeAndFlush(productImage)
    await this.storageService.remove(fileId)
  }

  async findAllProductCategory(productId: number) {
    const product = await this.productsRepository.findOne(
      { id: productId },
      {
        populate: ['categories']
      }
    )
    return product?.categories || []
  }

  async updateProductCategory(productId: number, { categories }: UpdateProductCategoryDto) {
    const product = await this.productsRepository.findOneOrFail({ id: productId })
    await product.categories.removeAll()
    for (const categoryId of categories) {
      const category = await this.categoryRepository.findOneOrFail({ id: +categoryId })
      product.categories.add(category)
    }
    await this.productsRepository.getEntityManager().persistAndFlush(product)
  }
}

import { Injectable } from '@nestjs/common'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private storageService: StorageService
  ) {}

  async create({ ...fillable }: CreateProductDto) {
    const product = new Product()

    this.productsRepository.merge(product, fillable)

    await this.productsRepository.save(product)

    return product
  }

  async findAll(query: FindAllProductQueryDto) {
    const [rows, total] = await this.productsRepository.findAndCount(query.options)
    return { rows, total }
  }

  async findOne(id: number) {
    return this.productsRepository.findOneByOrFail({ id })
  }

  async update(id: number, { ...fillable }: UpdateProductDto) {
    const product = await this.findOne(id)

    this.productsRepository.merge(product, fillable)

    await this.productsRepository.save(product)
  }

  async remove(id: number) {
    await this.productsRepository.delete(id)
  }

  async createProductImage(productId: number, upload: Express.Multer.File) {
    const product = await this.productsRepository.findOneOrFail({
      where: { id: productId },
      relations: {
        images: true
      }
    })

    const file = await this.storageService.upload(
      upload,
      join(String(productId), `${nanoid()}-${upload.originalname}`)
    )
    const productImage = new ProductImage()
    productImage.file = file
    productImage.product = product
    productImage.rank = product.images.length
    await this.productImageRepository.save(productImage)
    return productImage
  }

  async findAllProductImage(productId: number) {
    return await this.productImageRepository.find({
      where: { productId },
      order: {
        rank: 'ASC'
      }
    })
  }

  async findOneProductImage(productId: number, fileId: number) {
    return this.productImageRepository.findOneByOrFail({ productId, fileId })
  }

  async updateProductImage(
    productId: number,
    fileId: number,
    { ...fillable }: UpdateProductImageDto
  ) {
    const productImage = await this.findOneProductImage(productId, fileId)

    this.productImageRepository.merge(productImage, fillable)

    await this.productImageRepository.save(productImage)
  }

  async sortProductImage(productId: number, { files }: SortProductImageDto) {
    for (const fileId of Object.keys(files)) {
      const productImage = await this.productImageRepository.findOneByOrFail({
        productId,
        fileId: +fileId
      })
      productImage.rank = files[fileId]
      await this.productImageRepository.save(productImage)
    }
  }

  async removeProductImage(productId: number, fileId: number) {
    await this.productImageRepository.delete({
      productId,
      fileId
    })
    await this.storageService.remove(fileId)
  }

  async findAllProductCategory(productId: number) {
    const product = await this.productsRepository.findOne({
      where: {
        id: productId
      },
      relations: {
        categories: true
      }
      // order: {
      //   rank: 'ASC'
      // }
    })
    return product?.categories || []
  }

  async updateProductCategory(productId: number, { categories }: UpdateProductCategoryDto) {
    console.log(productId, categories)
    // const product = await this.productsRepository.findOne({
    //   where: {
    //     id: productId
    //   },
    //   // relations: {
    //   //   categories
    //   // }
    // })
    // const categories: Category[] = []
    // for (const categoryId of categories) {
    //   // console.log(productId, categoryId)
    //   const category = await this.categoryRepository.findOneByOrFail({
    //     id: +categoryId
    //   })
    //   categories.push(category)
    // //   productImage.rank = files[categoryId]
    // //   await this.productImageRepository.save(productImage)
    // }
    // product?.categories = categories
  }
}

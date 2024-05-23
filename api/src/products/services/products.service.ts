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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
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

  async productImageFindAll(id: number) {
    const product = await this.productsRepository.findOneOrFail({
      where: { id },
      relations: {
        images: true
      }
    })
    return product.images
  }

  async productImageCreate(id: number, upload: Express.Multer.File) {
    const product = await this.productsRepository.findOneOrFail({
      where: { id },
      relations: {
        images: true
      }
    })

    const file = await this.storageService.upload(upload, join(String(id), upload.originalname))
    const productImage = new ProductImage()
    productImage.file = file
    productImage.product = product
    productImage.rank = product.images.length
    await this.productImageRepository.save(productImage)
    return productImage
  }
}

import { Injectable } from '@nestjs/common'
import { CreateProductDto } from '../dto/create-product.dto'
import { UpdateProductDto } from '../dto/update-product.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from '../entities/product.entity'
import { FindAllProductQueryDto } from '../dto/find-all-product-query.dto'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>
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
}

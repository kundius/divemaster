import { Injectable } from '@nestjs/common'
import {
  CreatePropertyDto,
  FindAllPropertyCategoriesDto,
  FindAllPropertyDto,
  FindOnePropertyDto,
  UpdatePropertyCategoriesDto,
  UpdatePropertyDto
} from '../dto/properties.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'
import { Property } from '../entities/property.entity'
import { Category } from '../entities/category.entity'
import { ProductOption } from '../entities/product-option.entity'

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(ProductOption)
    private productOptionRepository: Repository<ProductOption>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async create({ ...fillable }: CreatePropertyDto) {
    const record = new Property()

    this.propertyRepository.merge(record, fillable)

    await this.propertyRepository.save(record)

    return record
  }

  async findAll(dto: FindAllPropertyDto) {
    const where: FindOptionsWhere<Property> = {}
    const relations: FindOptionsRelations<Property> = {}

    if (dto.query) {
      where.caption = Like(`%${dto.query}%`)
    }

    const [rows, total] = await this.propertyRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOnePropertyDto) {
    return this.propertyRepository.findOneByOrFail({ id })
  }

  async update(id: number, { ...fillable }: UpdatePropertyDto) {
    const record = await this.propertyRepository.findOneByOrFail({ id })

    this.propertyRepository.merge(record, fillable)

    await this.propertyRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.propertyRepository.delete({ id })
  }

  async findAllCategories(propertyId: number, query?: FindAllPropertyCategoriesDto) {
    const record = await this.propertyRepository.findOneOrFail({
      where: { id: propertyId },
      relations: {
        categories: true
      }
    })
    return record.categories
  }

  async updateCategories(id: number, { categories }: UpdatePropertyCategoriesDto) {
    const record = await this.propertyRepository.findOneOrFail({
      where: { id },
      relations: {
        categories: true
      }
    })

    record.categories = await Promise.all(
      categories.map(async (cat) => this.categoryRepository.findOneByOrFail({ id: +cat }))
    )

    await this.propertyRepository.save(record)

    return record.categories
  }

  async suggestions(propertyId: number) {
    const property = await this.propertyRepository.findOneByOrFail({ id: propertyId })
    const options = await this.productOptionRepository.find({ where: { name: property.key } })
    return Array.from(new Set(options.map((option) => option.content)))
  }
}

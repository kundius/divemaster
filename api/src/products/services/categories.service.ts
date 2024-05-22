import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from '../entities/category.entity'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { FindAllCategoryQueryDto } from '../dto/find-all-category-query.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async create({ ...fillable }: CreateCategoryDto) {
    const category = new Category()

    this.categoriesRepository.merge(category, fillable)

    await this.categoriesRepository.save(category)

    return category
  }

  async findAll(query: FindAllCategoryQueryDto) {
    const [rows, total] = await this.categoriesRepository.findAndCount(query.options)
    return { rows, total }
  }

  async findOne(id: number) {
    return this.categoriesRepository.findOneByOrFail({ id })
  }

  async update(id: number, { ...fillable }: UpdateCategoryDto) {
    const category = await this.findOne(id)

    this.categoriesRepository.merge(category, fillable)

    await this.categoriesRepository.save(category)
  }

  async remove(id: number) {
    await this.categoriesRepository.delete(id)
  }
}

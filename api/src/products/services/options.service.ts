import { EntityRepository, FilterQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import {
  CreateOptionDto,
  FindAllOptionCategoriesDto,
  FindAllOptionDto,
  FindOneOptionDto,
  UpdateOptionCategoriesDto,
  UpdateOptionDto
} from '../dto/options.dto'
import { Option } from '../entities/option.entity'
import { Category } from '../entities/category.entity'

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: EntityRepository<Option>,
    @InjectRepository(Category)
    private categoryRepository: EntityRepository<Category>
  ) {}

  async create({ ...fillable }: CreateOptionDto) {
    const option = new Option()

    this.optionsRepository.assign(option, fillable)

    await this.optionsRepository.getEntityManager().persistAndFlush(option)

    return option
  }

  async findAll(query: FindAllOptionDto) {
    const where: FilterQuery<Option> = {}
    if (query.query) {
      where.caption = {
        $like: '%' + query.query + '%'
      }
    }
    const [rows, total] = await this.optionsRepository.findAndCount(where, query.options)
    return { rows, total }
  }

  async findOne(id: number, query?: FindOneOptionDto) {
    return this.optionsRepository.findOneOrFail({ id }, query?.options)
  }

  async update(id: number, { ...fillable }: UpdateOptionDto) {
    const option = await this.findOne(id)

    this.optionsRepository.assign(option, fillable)

    await this.optionsRepository.getEntityManager().persistAndFlush(option)
  }

  async remove(id: number) {
    const option = await this.optionsRepository.findOneOrFail({ id })
    await this.optionsRepository.getEntityManager().removeAndFlush(option)
  }

  async findAllCategories(optionId: number, query?: FindAllOptionCategoriesDto) {
    const where: FilterQuery<Category> = {}
    where.options = { $some: { id: optionId } }
    return this.categoryRepository.find(where, query?.options)
  }

  async updateCategories(optionId: number, { categories }: UpdateOptionCategoriesDto) {
    const option = await this.optionsRepository.findOneOrFail({ id: optionId })
    await option.categories.removeAll()
    for (const categoryId of categories) {
      const category = await this.categoryRepository.findOneOrFail({ id: +categoryId })
      option.categories.add(category)
    }
    await this.optionsRepository.getEntityManager().persistAndFlush(option)
  }
}

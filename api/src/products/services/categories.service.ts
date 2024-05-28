import { Injectable } from '@nestjs/common'
import { Category } from '../entities/category.entity'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { FindAllCategoryQueryDto } from '../dto/find-all-category-query.dto'
import { UpdateCategoryDto } from '../dto/update-category.dto'
import { EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { FindOneCategoryQueryDto } from '../dto/find-one-category-query.dto'
import { StorageService } from '@/storage/services/storage.service'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: EntityRepository<Category>,
    private storageService: StorageService
  ) {}

  async create({ parentId, imageId, ...fillable }: CreateCategoryDto) {
    const category = new Category()

    this.categoriesRepository.assign(category, fillable)

    if (typeof parentId === 'number') {
      category.parent = await this.findOne(parentId)
    }

    await this.categoriesRepository.getEntityManager().persistAndFlush(category)

    return category
  }

  async findAll(query: FindAllCategoryQueryDto) {
    const [rows, total] = await this.categoriesRepository.findAndCount(query.where, query.options)
    return { rows, total }
  }

  async findOne(id: number, query?: FindOneCategoryQueryDto) {
    return this.categoriesRepository.findOneOrFail({ id }, query?.options)
  }

  async findOneByAlias(alias: string, query?: FindOneCategoryQueryDto) {
    return this.categoriesRepository.findOne({ alias }, query?.options)
  }

  async update(id: number, { parentId, imageId, ...fillable }: UpdateCategoryDto) {
    const category = await this.findOne(id)

    this.categoriesRepository.assign(category, fillable)

    if (typeof parentId !== 'undefined') {
      category.parent = parentId ? await this.findOne(parentId) : null
    }
    if (typeof parentId !== 'undefined') {
      category.parent = parentId ? await this.findOne(parentId) : null
    }

    await this.categoriesRepository.getEntityManager().persistAndFlush(category)
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneOrFail({ id })
    await this.categoriesRepository.getEntityManager().removeAndFlush(category)
  }
}

import { Injectable } from '@nestjs/common'
import {
  CreateCategoryDto,
  FindAllCategoryQueryDto,
  FindOneCategoryQueryDto,
  UpdateCategoryDto
} from '../dto/categories.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Category } from '../entities/category.entity'
import { FindOptionsRelations, FindOptionsWhere, IsNull, Like, Repository } from 'typeorm'
import { slugify } from '@/lib/utils'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.categoryRepository.findOne({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ parentId, imageId, ...fillable }: CreateCategoryDto) {
    const record = new Category()

    this.categoryRepository.merge(record, fillable)

    if (typeof parentId !== 'undefined') {
      record.parentId = parentId
    }

    if (typeof imageId !== 'undefined') {
      record.imageId = imageId
    }

    await this.categoryRepository.save(record)

    return record
  }

  async findAll(dto: FindAllCategoryQueryDto) {
    const where: FindOptionsWhere<Category> = {}

    if (!dto.allowInactive) {
      where.active = true
    }

    if (dto.query) {
      where.title = Like(`%${dto.query}%`)
    }

    if (typeof dto.parent !== 'undefined') {
      where.parentId = dto.parent === 0 ? IsNull() : dto.parent
    }

    const [rows, total] = await this.categoryRepository.findAndCount({
      where,
      take: dto.take,
      skip: dto.skip,
      order: {
        [dto.sort]: dto.dir
      }
    })

    return { rows, total }
  }

  async findOne(id: number, dto: FindOneCategoryQueryDto) {
    const where: FindOptionsWhere<Category> = { id }

    if (!dto.allowInactive) {
      where.active = true
    }

    const record = await this.categoryRepository.findOne({ where })

    return record
  }

  async findOneByAlias(alias: string, dto: FindOneCategoryQueryDto) {
    const where: FindOptionsWhere<Category> = { alias }

    if (!dto.allowInactive) {
      where.active = true
    }

    const record = await this.categoryRepository.findOne({ where })

    return record
  }

  async update(id: number, { parentId, imageId, ...fillable }: UpdateCategoryDto) {
    const record = await this.categoryRepository.findOneByOrFail({ id })

    this.categoryRepository.merge(record, fillable)

    if (typeof parentId !== 'undefined') {
      record.parentId = parentId
    }

    if (typeof imageId !== 'undefined') {
      record.imageId = imageId
    }

    await this.categoryRepository.save(record)

    return record
  }

  async remove(id: number) {
    return this.categoryRepository.delete({ id })
  }
}

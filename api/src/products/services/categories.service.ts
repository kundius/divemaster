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

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

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
    const relations: FindOptionsRelations<Category> = {}

    if (dto.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      relations.children = true
    }

    if (dto.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      relations.parent = true
    }

    if (dto.active) {
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
      skip: dto.skip,
      take: dto.take,
      order: { [dto.sort]: dto.dir }
    })

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOneCategoryQueryDto) {
    const where: FindOptionsWhere<Category> = {}
    const relations: FindOptionsRelations<Category> = {}

    where.id = id

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      relations.children = true
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      relations.parent = true
    }

    if (dto?.active) {
      where.active = true
    }

    const record = await this.categoryRepository.findOne({
      where,
      relations
    })

    return record
  }

  async findOneByAlias(alias: string, dto?: FindOneCategoryQueryDto) {
    const where: FindOptionsWhere<Category> = {}
    const relations: FindOptionsRelations<Category> = {}

    where.alias = alias

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      relations.children = true
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      relations.parent = true
    }

    if (dto?.active) {
      where.active = true
    }

    const record = await this.categoryRepository.findOne({
      where,
      relations
    })

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

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
    const qb = this.categoryRepository.createQueryBuilder('category')

    if (dto.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      qb.leftJoinAndSelect('category.children', 'children')
      qb.orderBy('children.rank', 'ASC')
    }

    if (dto.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      qb.leftJoinAndSelect('category.parent', 'parent')
    }

    if (dto.active) {
      qb.andWhere('category.active = :categoryActive', { categoryActive: true })
    }

    if (dto.query) {
      qb.andWhere('category.title LIKE :categoryTitle', { categoryTitle: `%${dto.query}%` })
    }

    if (typeof dto.parent !== 'undefined') {
      if (dto.parent === 0) {
        qb.andWhere('category.parentId IS NULL')
      } else {
        qb.andWhere('category.parentId = :categoryParent', { categoryParent: dto.parent })
      }
    }

    qb.orderBy(`category.${dto.sort}`, dto.dir)
    qb.skip(dto.skip)
    qb.take(dto.take)

    const [rows, total] = await qb.getManyAndCount()

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOneCategoryQueryDto) {
    const qb = this.categoryRepository.createQueryBuilder('category')

    qb.andWhere('category.id = :categoryId', { categoryId: id })

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      qb.leftJoinAndSelect('category.children', 'children')
      qb.orderBy('children.rank', 'ASC')
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      qb.leftJoinAndSelect('category.parent', 'parent')
    }

    if (dto?.active) {
      qb.andWhere('category.active = :categoryActive', { categoryActive: true })
    }

    const record = await qb.getOne()

    return record
  }

  async findOneByAlias(alias: string, dto?: FindOneCategoryQueryDto) {
    const qb = this.categoryRepository.createQueryBuilder('category')

    qb.andWhere('category.alias = :categoryAlias', { categoryAlias: alias })

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      qb.leftJoinAndSelect('category.children', 'children')
      qb.orderBy('children.rank', 'ASC')
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      qb.leftJoinAndSelect('category.parent', 'parent')
    }

    if (dto?.active) {
      qb.andWhere('category.active = :categoryActive', { categoryActive: true })
    }

    const record = await qb.getOne()

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

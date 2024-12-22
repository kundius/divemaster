import { Injectable } from '@nestjs/common'
import { Category } from '../entities/category.entity'
import {
  CreateRequestContext,
  EntityRepository,
  FilterOptions,
  ObjectQuery,
  OrderDefinition,
  Populate,
  QueryOrder
} from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { StorageService } from '@/storage/services/storage.service'
import {
  CreateCategoryDto,
  FindAllCategoryQueryDto,
  FindOneCategoryQueryDto,
  UpdateCategoryDto
} from '../dto/categories.dto'
import { PrismaService } from '@/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectRepository(Category)
    private categoriesRepository: EntityRepository<Category>,
    private storageService: StorageService
  ) {}

  async create({ parentId, imageId, ...fillable }: CreateCategoryDto) {
    const category = new Category()

    this.categoriesRepository.assign(category, fillable)

    if (typeof parentId !== 'undefined') {
      category.parent = parentId ? await this.categoriesRepository.findOneOrFail(parentId) : null
    }
    if (typeof imageId !== 'undefined') {
      category.image = imageId ? await this.storageService.findOne(imageId) : null
    }

    await this.categoriesRepository.getEntityManager().persistAndFlush(category)

    return category
  }

  async findAll(dto: FindAllCategoryQueryDto) {
    const args: Prisma.CategoryFindManyArgs = {}
    args.where = {}
    args.include = {}
    // let exclude: 'description'[] = []
    // let populate: Populate<
    //   Category,
    //   'children' | 'children.children' | 'parent' | 'parent.parent'
    // > = []
    // let filters: FilterOptions = []
    // let populateOrderBy: OrderDefinition<Category> = {}
    // let populateWhere: ObjectQuery<Category> = {}
    // let where: ObjectQuery<Category> = {}

    if (dto.withChildren) {
      args.include.children = true
      //   // HIERARCHY_DEPTH_LIMIT
      //   populate = [...populate, 'children', 'children.children']
      //   populateOrderBy = { ...populateOrderBy, children: { id: QueryOrder.ASC } }
      //   if (dto.active) {
      //     populateWhere = { ...populateWhere, children: { active: true } }
      //   }
    }

    if (dto.withParent) {
      args.include.parent = true
      //   // HIERARCHY_DEPTH_LIMIT
      //   populate = [...populate, 'parent', 'parent.parent']
    }

    if (!dto.withContent) {
      args.omit = { description: true }
      //   exclude = [...exclude, 'description']
    }

    if (dto.active) {
      args.where.active = true
      //   filters = [...filters, 'active']
    }

    if (dto.query) {
      args.where.title = { contains: dto.query }
      //   where = { ...where, title: { $like: '%' + dto.query + '%' } }
    }

    if (typeof dto.parent !== 'undefined') {
      args.where.parent_id = dto.parent === 0 ? null : dto.parent
      //   where = { ...where, parent: dto.parent === 0 ? null : dto.parent }
    }

    args.orderBy = { [dto.sort]: dto.dir.toLowerCase() }
    args.skip = dto.skip
    args.take = dto.take

    // const [rows, total] = await this.categoriesRepository.findAndCount(where, {
    //   limit: dto.take,
    //   offset: dto.skip,
    //   orderBy: { [dto.sort]: dto.dir },
    //   exclude,
    //   populate,
    //   filters,
    //   populateOrderBy,
    //   populateWhere
    // })

    const rows = await this.prismaService.category.findMany(args)
    const total = await this.prismaService.category.count({ where: args.where })

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOneCategoryQueryDto) {
    let exclude: 'description'[] = []
    let populate: Populate<
      Category,
      'children' | 'children.children' | 'parent' | 'parent.parent'
    > = []
    let filters: FilterOptions = []
    let populateOrderBy: OrderDefinition<Category> = {}
    let populateWhere: ObjectQuery<Category> = {}

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      populate = [...populate, 'children', 'children.children']
      populateOrderBy = { ...populateOrderBy, children: { id: QueryOrder.ASC } }
      if (dto?.active) {
        populateWhere = { ...populateWhere, children: { active: true } }
      }
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      populate = [...populate, 'parent', 'parent.parent']
    }

    if (!dto?.withContent) {
      exclude = [...exclude, 'description']
    }

    if (dto?.active) {
      filters = [...filters, 'active']
    }

    return this.categoriesRepository.findOneOrFail(
      { id },
      {
        filters,
        exclude,
        populate,
        populateOrderBy,
        populateWhere
      }
    )
  }

  async findOneByAlias(alias: string, dto?: FindOneCategoryQueryDto) {
    let exclude: 'description'[] = []
    let populate: Populate<
      Category,
      'children' | 'children.children' | 'parent' | 'parent.parent'
    > = []
    let filters: FilterOptions = []
    let populateOrderBy: OrderDefinition<Category> = {}
    let populateWhere: ObjectQuery<Category> = {}

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      populate = [...populate, 'children', 'children.children']
      populateOrderBy = { ...populateOrderBy, children: { id: QueryOrder.ASC } }
      if (dto?.active) {
        populateWhere = { ...populateWhere, children: { active: true } }
      }
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      populate = [...populate, 'parent', 'parent.parent']
    }

    if (!dto?.withContent) {
      exclude = [...exclude, 'description']
    }

    if (dto?.active) {
      filters = [...filters, 'active']
    }

    return this.categoriesRepository.findOne(
      { alias },
      {
        filters,
        exclude,
        populate,
        populateOrderBy,
        populateWhere
      }
    )
  }

  async update(id: number, { parentId, imageId, ...fillable }: UpdateCategoryDto) {
    const category = await this.findOne(id)

    this.categoriesRepository.assign(category, fillable)

    if (typeof parentId !== 'undefined') {
      category.parent = parentId ? await this.categoriesRepository.findOneOrFail(parentId) : null
    }
    if (typeof imageId !== 'undefined') {
      category.image = imageId ? await this.storageService.findOne(imageId) : null
    }

    await this.categoriesRepository.getEntityManager().persistAndFlush(category)
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneOrFail({ id })
    await this.categoriesRepository.getEntityManager().removeAndFlush(category)
  }
}

import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CreateCategoryDto,
  FindAllCategoryQueryDto,
  FindOneCategoryQueryDto,
  UpdateCategoryDto
} from '../dto/categories.dto'

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ parentId, imageId, ...fillable }: CreateCategoryDto) {
    const data: Prisma.CategoryCreateArgs['data'] = fillable

    if (typeof parentId !== 'undefined') {
      data.parent = parentId ? { connect: { id: parentId } } : {}
    }

    if (typeof imageId !== 'undefined') {
      data.image = imageId ? { connect: { id: imageId } } : {}
    }

    const category = await this.prismaService.category.create({ data })

    return category
  }

  async findAll(dto: FindAllCategoryQueryDto) {
    const args: Prisma.CategoryFindManyArgs = {}

    args.where = {}
    args.include = {}

    if (dto.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      args.include.children = true
    }

    if (dto.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      args.include.parent = true
    }

    if (!dto.withContent) {
      args.omit = { description: true }
    }

    if (dto.active) {
      args.where.active = true
    }

    if (dto.query) {
      args.where.title = { contains: dto.query }
    }

    if (typeof dto.parent !== 'undefined') {
      args.where.parent_id = dto.parent === 0 ? null : dto.parent
    }

    args.orderBy = { [dto.sort]: dto.dir.toLowerCase() }
    args.skip = dto.skip
    args.take = dto.take

    const rows = await this.prismaService.category.findMany(args)
    const total = await this.prismaService.category.count({ where: args.where })

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOneCategoryQueryDto) {
    const args: Prisma.CategoryFindFirstArgs = {}

    args.where = { id }
    args.include = {}

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      args.include.children = true
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      args.include.parent = true
    }

    if (!dto?.withContent) {
      args.omit = { description: true }
    }

    if (dto?.active) {
      args.where.active = true
    }

    const category = await this.prismaService.category.findFirst(args)

    return category
  }

  async findOneByAlias(alias: string, dto?: FindOneCategoryQueryDto) {
    const args: Prisma.CategoryFindFirstArgs = {}

    args.where = { alias }
    args.include = {}

    if (dto?.withChildren) {
      // HIERARCHY_DEPTH_LIMIT
      args.include.children = true
    }

    if (dto?.withParent) {
      // HIERARCHY_DEPTH_LIMIT
      args.include.parent = true
    }

    if (!dto?.withContent) {
      args.omit = { description: true }
    }

    if (dto?.active) {
      args.where.active = true
    }

    const category = await this.prismaService.category.findFirst(args)

    return category
  }

  async update(id: number, { parentId, imageId, ...fillable }: UpdateCategoryDto) {
    const data: Prisma.CategoryUpdateArgs['data'] = fillable

    if (typeof parentId !== 'undefined') {
      data.parent = parentId ? { connect: { id: parentId } } : {}
    }

    if (typeof imageId !== 'undefined') {
      data.image = imageId ? { connect: { id: imageId } } : {}
    }

    const category = await this.prismaService.category.update({ where: { id }, data })

    return category
  }

  async remove(id: number) {
    const category = await this.prismaService.category.delete({ where: { id } })

    return category
  }
}

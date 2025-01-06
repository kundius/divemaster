import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import {
  CreateOptionDto,
  FindAllOptionCategoriesDto,
  FindAllOptionDto,
  FindOneOptionDto,
  UpdateOptionCategoriesDto,
  UpdateOptionDto
} from '../dto/options.dto'

@Injectable()
export class OptionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ ...fillable }: CreateOptionDto) {
    const option = await this.prismaService.option.create({ data: { ...fillable } })
    return option
  }

  async findAll(dto: FindAllOptionDto) {
    const args: Prisma.OptionFindManyArgs = {}
    args.where = {}

    if (dto.query) {
      args.where.caption = { contains: dto.query }
    }

    args.take = dto.take
    args.skip = dto.skip
    args.orderBy = { [dto.sort]: dto.dir }

    const rows = await this.prismaService.option.findMany(args)
    const total = await this.prismaService.option.count({ where: args.where })

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOneOptionDto) {
    const option = await this.prismaService.option.findUniqueOrThrow({ where: { id } })
    return option
  }

  async update(id: number, { ...fillable }: UpdateOptionDto) {
    const option = await this.prismaService.option.update({
      where: { id },
      data: { ...fillable }
    })
    return option
  }

  async remove(id: number) {
    const option = await this.prismaService.option.delete({ where: { id } })
    return option
  }

  async findAllCategories(optionId: number, query?: FindAllOptionCategoriesDto) {
    const categories = await this.prismaService.category.findMany({
      where: { options: { some: { optionId } } }
    })
    return categories
  }

  async updateCategories(optionId: number, { categories }: UpdateOptionCategoriesDto) {
    const option = await this.prismaService.option.update({
      where: { id: optionId },
      data: {
        categories: {
          deleteMany: {},
          create: categories.map((id) => ({
            category: { connect: { id: +id } }
          }))
        }
      },
      include: { categories: { include: { category: true } } }
    })
    return option.categories.map((item) => item.category)
  }

  async findAllValues(optionId: number) {
    const optionValues = await this.prismaService.optionValue.groupBy({
      by: ['content'],
      where: { option: { id: optionId } }
    })
    return optionValues.map((item) => item.content)
  }
}

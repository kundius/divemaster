import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { CreateBrandDto, FindAllBrandQueryDto, UpdateBrandDto } from '../dto/brands.dto'

@Injectable()
export class BrandsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ ...fillable }: CreateBrandDto) {
    const data: Prisma.BrandCreateArgs['data'] = fillable

    const brand = await this.prismaService.brand.create({ data })

    return brand
  }

  async findAll(dto: FindAllBrandQueryDto) {
    const args: Prisma.BrandFindManyArgs = {}

    args.where = {}
    args.include = {}

    if (dto.query) {
      args.where.title = { contains: dto.query }
    }

    const rows = await this.prismaService.brand.findMany(args)
    const total = await this.prismaService.brand.count({ where: args.where })

    return { rows, total }
  }

  async findOne(id: number) {
    const args: Prisma.BrandFindFirstArgs = {}

    args.where = { id }
    args.include = {}

    const brand = await this.prismaService.brand.findFirst(args)

    return brand
  }

  async update(id: number, { ...fillable }: UpdateBrandDto) {
    const data: Prisma.BrandUpdateArgs['data'] = fillable

    const brand = await this.prismaService.brand.update({ where: { id }, data })

    return brand
  }

  async remove(id: number) {
    const brand = await this.prismaService.brand.delete({ where: { id } })

    return brand
  }
}

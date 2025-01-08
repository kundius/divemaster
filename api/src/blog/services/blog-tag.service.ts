import { slugify } from '@/lib/utils'
import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'

@Injectable()
export class BlogTagService {
  constructor(private readonly prismaService: PrismaService) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.prismaService.blogTag.findUnique({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ alias, metadata, ...fillable }: BlogTagCreateDto) {
    const data: Prisma.BlogTagCreateArgs['data'] = {
      ...fillable,
      alias: await this.makeAlias(alias || fillable.name, true)
    }

    const record = await this.prismaService.blogTag.create({ data })

    return record
  }

  // TODO_PRISMA добавить количество постов
  async findAll(dto: BlogTagFindAllDto) {
    const args: Prisma.BlogTagFindManyArgs = {}

    args.where = {}
    args.include = {}

    if (dto.query) {
      args.where.name = { contains: dto.query }
    }

    args.orderBy = { [dto.sort]: dto.dir }
    args.skip = dto.skip
    args.take = dto.take

    const rows = await this.prismaService.blogTag.findMany(args)
    const total = await this.prismaService.blogTag.count({ where: args.where })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.prismaService.blogTag.findUniqueOrThrow({ where: { id } })
  }

  async findOneByAlias(alias: string) {
    return this.prismaService.blogTag.findUniqueOrThrow({ where: { alias } })
  }

  async findOneByName(name: string) {
    return this.prismaService.blogTag.findFirstOrThrow({ where: { name } })
  }

  async update(id: number, { alias, ...fillable }: BlogTagUpdateDto) {
    let record = await this.findOne(id)

    const data: Prisma.BlogTagUpdateArgs['data'] = fillable

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      data.alias = await this.makeAlias(alias || record.name, true)
    }

    record = await this.prismaService.blogTag.update({
      where: { id },
      data
    })

    return record
  }

  async remove(id: number) {
    const record = await this.prismaService.blogTag.delete({ where: { id } })

    return record
  }

  async findOrCreateTagsByName(names: string[]) {
    return Promise.all(
      names.map(async (name) => {
        return await this.prismaService.blogTag.upsert({
          where: {
            alias: await this.makeAlias(name)
          },
          update: {
            name
          },
          create: {
            alias: await this.makeAlias(name, true),
            name
          }
        })
      })
    )
  }
}

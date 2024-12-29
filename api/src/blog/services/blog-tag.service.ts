import { slugify } from '@/lib/utils'
import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'

@Injectable()
export class BlogTagService {
  constructor(private readonly prismaService: PrismaService) {}

  async makeUniqueAlias(from: string, n: number = 0) {
    let alias = slugify(from)
    if (n !== 0) {
      alias = `${alias}-${n}`
    }
    const record = await this.prismaService.blogTag.findUnique({ where: { alias } })
    if (!record) {
      return alias
    } else {
      return this.makeUniqueAlias(from, n + 1)
    }
  }

  async create({ alias, metadata, ...fillable }: BlogTagCreateDto) {
    const data: Prisma.BlogTagCreateArgs['data'] = {
      ...fillable,
      alias: await this.makeUniqueAlias(alias || fillable.name)
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
      data.alias = await this.makeUniqueAlias(alias || record.name)
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
}

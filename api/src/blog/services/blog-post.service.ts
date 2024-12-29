import { slugify } from '@/lib/utils'
import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BlogPostCreateDto, BlogPostFindAllDto, BlogPostUpdateDto } from '../dto/blog-post.dto'

@Injectable()
export class BlogPostService {
  constructor(private readonly prismaService: PrismaService) {}

  async makeUniqueAlias(from: string, n: number = 0) {
    let alias = slugify(from)
    if (n !== 0) {
      alias = `${alias}-${n}`
    }
    const record = await this.prismaService.blogPost.findUnique({ where: { alias } })
    if (!record) {
      return alias
    } else {
      return this.makeUniqueAlias(from, n + 1)
    }
  }

  async create({ imageId, tags, alias, ...fillable }: BlogPostCreateDto) {
    const data: Prisma.BlogPostCreateArgs['data'] = {
      ...fillable,
      alias: await this.makeUniqueAlias(alias || fillable.title)
    }

    if (typeof fillable.content !== 'undefined') {
      data.read_time = String(Math.floor(fillable.content.length / 1000))
    }

    if (typeof imageId !== 'undefined') {
      data.image = imageId ? { connect: { id: imageId } } : {}
    }

    if (typeof tags !== 'undefined') {
      data.tags = {
        create: tags.map((tagId) => ({ blog_tag: { connect: { id: +tagId } } }))
      }
    }

    const record = await this.prismaService.blogPost.create({ data })

    return record
  }

  async findAll(dto: BlogPostFindAllDto) {
    const args: Prisma.BlogPostFindManyArgs = {}

    args.where = {}
    args.include = {
      image: true,
      tags: true
    }

    if (dto.query) {
      args.where.title = { contains: dto.query }
    }

    if (!dto.withExtraContent) {
      args.omit = { metadata: true, content: true, long_title: true }
    }

    if (dto.tags) {
      args.where.tags = { some: { blog_tag: { name: { in: dto.tags } } } }
    }

    args.orderBy = { [dto.sort]: dto.dir }
    args.skip = dto.skip
    args.take = dto.take

    const rows = await this.prismaService.blogPost.findMany(args)
    const total = await this.prismaService.blogPost.count({ where: args.where })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.prismaService.blogPost.findUniqueOrThrow({
      where: { id },
      include: { tags: true, image: true }
    })
  }

  async findOneByAlias(alias: string) {
    return this.prismaService.blogPost.findUniqueOrThrow({
      where: { alias },
      include: { tags: true, image: true }
    })
  }

  async update(id: number, { imageId, tags, alias, ...fillable }: BlogPostUpdateDto) {
    let record = await this.findOne(id)

    const data: Prisma.BlogPostUpdateArgs['data'] = fillable

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      data.alias = await this.makeUniqueAlias(alias || record.title)
    }

    if (typeof fillable.content !== 'undefined') {
      data.read_time = String(Math.ceil(fillable.content.length / 1000))
    }

    if (typeof imageId !== 'undefined') {
      data.image = imageId ? { connect: { id: imageId } } : {}
    }

    if (typeof tags !== 'undefined') {
      data.tags = {
        deleteMany: {},
        create: tags.map((tagId) => ({ blog_tag: { connect: { id: +tagId } } }))
      }
    }

    record = await this.prismaService.blogPost.update({
      where: { id },
      data,
      include: { tags: true, image: true }
    })

    return record
  }

  async remove(id: number) {
    const record = await this.prismaService.blogPost.delete({ where: { id } })

    return record
  }

  async findNeighbors(id: number) {
    const target = await this.findOne(id)
    const prev = this.prismaService.blogPost.findFirst({
      where: { created_at: { lt: target.created_at } },
      orderBy: { created_at: 'desc' },
      omit: { metadata: true, content: true, long_title: true }
    })
    const next = this.prismaService.blogPost.findFirst({
      where: { created_at: { gt: target.created_at } },
      orderBy: { created_at: 'asc' },
      omit: { metadata: true, content: true, long_title: true }
    })
    return Promise.all([prev, next])
  }
}

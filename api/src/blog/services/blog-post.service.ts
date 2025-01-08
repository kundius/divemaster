import { slugify } from '@/lib/utils'
import { PrismaService } from '@/prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { BlogPostCreateDto, BlogPostFindAllDto, BlogPostUpdateDto } from '../dto/blog-post.dto'
import { BlogTagService } from './blog-tag.service'

@Injectable()
export class BlogPostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly blogTagService: BlogTagService
  ) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.prismaService.blogPost.findUnique({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ imageId, tags, alias, ...fillable }: BlogPostCreateDto) {
    const data: Prisma.BlogPostCreateArgs['data'] = {
      ...fillable,
      alias: await this.makeAlias(alias || fillable.title, true)
    }

    if (typeof fillable.content !== 'undefined') {
      data.readTime = String(Math.floor(fillable.content.length / 1000))
    }

    if (typeof imageId !== 'undefined') {
      data.image = imageId ? { connect: { id: imageId } } : {}
    }

    if (typeof tags !== 'undefined') {
      const tagEntities = await this.blogTagService.findOrCreateTagsByName(tags)
      data.tags = {
        create: tagEntities.map((tag) => ({ blogTag: { connect: { id: tag.id } } }))
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
      tags: {
        include: {
          blogTag: true
        }
      }
    }

    if (dto.query) {
      args.where.title = { contains: dto.query }
    }

    if (!dto.withExtraContent) {
      args.omit = { metadata: true, content: true, longTitle: true }
    }

    if (dto.tags) {
      args.where.tags = { some: { blogTag: { name: { in: dto.tags } } } }
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
      include: {
        image: true,
        tags: {
          include: {
            blogTag: true
          }
        }
      }
    })
  }

  async findOneByAlias(alias: string) {
    return this.prismaService.blogPost.findUniqueOrThrow({
      where: { alias },
      include: {
        image: true,
        tags: {
          include: {
            blogTag: true
          }
        }
      }
    })
  }

  async update(id: number, { imageId, tags, alias, ...fillable }: BlogPostUpdateDto) {
    let record = await this.findOne(id)

    const data: Prisma.BlogPostUpdateArgs['data'] = fillable

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      data.alias = await this.makeAlias(alias || record.title, true)
    }

    if (typeof fillable.content !== 'undefined') {
      data.readTime = String(Math.ceil(fillable.content.length / 1000))
    }

    if (typeof imageId !== 'undefined') {
      data.image = imageId ? { connect: { id: imageId } } : {}
    }

    if (typeof tags !== 'undefined') {
      const tagEntities = await this.blogTagService.findOrCreateTagsByName(tags)
      data.tags = {
        deleteMany: {},
        create: tagEntities.map((tag) => ({ blogTag: { connect: { id: tag.id } } }))
      }
    }

    record = await this.prismaService.blogPost.update({
      where: { id },
      data,
      include: {
        image: true,
        tags: {
          include: {
            blogTag: true
          }
        }
      }
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
      where: { createdAt: { lt: target.createdAt } },
      orderBy: { createdAt: 'desc' },
      omit: { metadata: true, content: true, longTitle: true }
    })
    const next = this.prismaService.blogPost.findFirst({
      where: { createdAt: { gt: target.createdAt } },
      orderBy: { createdAt: 'asc' },
      omit: { metadata: true, content: true, longTitle: true }
    })
    return Promise.all([prev, next])
  }
}

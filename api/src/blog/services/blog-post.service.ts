import { slugify } from '@/lib/utils'
import { Injectable } from '@nestjs/common'
import { BlogPostCreateDto, BlogPostFindAllDto, BlogPostUpdateDto } from '../dto/blog-post.dto'
import { BlogTagService } from './blog-tag.service'
import { BlogPost } from '../entities/blog-post.entity'
import { InjectRepository } from '@nestjs/typeorm'
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  LessThan,
  Like,
  MoreThan,
  Repository
} from 'typeorm'

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    private readonly blogTagService: BlogTagService
  ) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.blogPostRepository.findOne({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ imageId, tags, alias, ...fillable }: BlogPostCreateDto) {
    const record = new BlogPost()

    this.blogPostRepository.merge(record, fillable)

    record.alias = await this.makeAlias(alias || fillable.title, true)

    if (typeof fillable.content !== 'undefined') {
      record.readTime = String(Math.floor(fillable.content.length / 1000))
    }

    if (typeof imageId !== 'undefined') {
      record.imageId = imageId
    }

    if (typeof tags !== 'undefined') {
      record.tags = await this.blogTagService.findOrCreateTagsByName(tags)
    }

    await this.blogPostRepository.save(record)

    return record
  }

  async findAll(dto: BlogPostFindAllDto) {
    const where: FindOptionsWhere<BlogPost> = {}
    const relations: FindOptionsRelations<BlogPost> = {}

    relations.image = true
    relations.tags = true

    if (dto.query) {
      where.title = Like(dto.query)
    }

    if (dto.tags) {
      where.tags = { name: In(dto.tags) }
    }

    const [rows, total] = await this.blogPostRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.blogPostRepository.findOneOrFail({
      where: { id },
      relations: {
        image: true,
        tags: true
      }
    })
  }

  async findOneByAlias(alias: string) {
    return this.blogPostRepository.findOne({
      where: { alias },
      relations: {
        image: true,
        tags: true
      }
    })
  }

  async update(id: number, { imageId, tags, alias, ...fillable }: BlogPostUpdateDto) {
    const record = await this.blogPostRepository.findOneOrFail({
      where: { id },
      relations: {
        image: true,
        tags: true
      }
    })

    this.blogPostRepository.merge(record, fillable)

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      record.alias = await this.makeAlias(alias || record.title, true)
    }

    if (typeof fillable.content !== 'undefined') {
      record.readTime = String(Math.ceil(fillable.content.length / 1000))
    }

    if (typeof imageId !== 'undefined') {
      record.imageId = imageId
    }

    if (typeof tags !== 'undefined') {
      record.tags = await this.blogTagService.findOrCreateTagsByName(tags)
    }

    await this.blogPostRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.blogPostRepository.delete({ id })
  }

  async findNeighbors(id: number) {
    const target = await this.blogPostRepository.findOneByOrFail({ id })
    const prev = this.blogPostRepository.findOne({
      where: { createdAt: LessThan(target.createdAt) },
      order: { createdAt: 'desc' }
    })
    const next = this.blogPostRepository.findOne({
      where: { createdAt: MoreThan(target.createdAt) },
      order: { createdAt: 'asc' }
    })
    return Promise.all([prev, next])
  }
}

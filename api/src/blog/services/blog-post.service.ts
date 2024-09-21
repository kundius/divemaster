import { EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { BlogPostCreateDto, BlogPostFindAllDto, BlogPostUpdateDto } from '../dto/blog-post.dto'
import { BlogPost } from '../entities/blog-post.entity'
import { StorageService } from '@/storage/services/storage.service'
import { BlogTag } from '../entities/blog-tag.entity'
import { slugify } from '@/lib/utils'
import { BlogTagService } from './blog-tag.service'
import { OperatorMap } from '@mikro-orm/core/typings'

@Injectable()
export class BlogPostService {
  constructor(
    private storageService: StorageService,
    @InjectRepository(BlogPost)
    private repository: EntityRepository<BlogPost>,
    private blogTagService: BlogTagService
  ) {}

  async makeUniqueAlias(from: string, n: number = 0) {
    let alias = slugify(from)
    if (n !== 0) {
      alias = `${alias}-${n}`
    }
    const record = await this.repository.findOne({ alias })
    if (!record) {
      return alias
    } else {
      return this.makeUniqueAlias(from, n + 1)
    }
  }

  async create({ imageId, tags, alias, ...fillable }: BlogPostCreateDto) {
    const record = new BlogPost()

    this.repository.assign(record, fillable)

    record.alias = await this.makeUniqueAlias(alias || fillable.title)

    if (typeof imageId !== 'undefined') {
      record.image = imageId ? await this.storageService.findOne(imageId) : null
    }

    await this.repository.getEntityManager().persistAndFlush(record)

    if (typeof tags !== 'undefined') {
      await this.setTags(record, tags)
    }

    return record
  }

  async findAll(dto: BlogPostFindAllDto) {
    const qb = this.repository.createQueryBuilder('post')

    if (dto.query) {
      qb.andWhere({ title: { $like: '%' + dto.query + '%' } })
    }

    if (dto.tags) {
      qb.andWhere({ tags: { name: { $in: dto.tags } } })
    }

    qb.leftJoinAndSelect('post.image', 'image')
    qb.leftJoinAndSelect('post.tags', 'tags')
    qb.limit(dto.take)
    qb.offset(dto.skip)
    qb.orderBy({ [dto.sort]: dto.dir })

    const [rows, total] = await qb.getResultAndCount()

    return { rows, total }
  }

  async findOne(id: number) {
    return this.repository.findOneOrFail(
      { id },
      {
        populate: ['tags', 'image']
      }
    )
  }

  async update(id: number, { imageId, tags, alias, ...fillable }: BlogPostUpdateDto) {
    const record = await this.repository.findOneOrFail(id)

    this.repository.assign(record, fillable)

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      record.alias = await this.makeUniqueAlias(alias || record.title)
    }

    if (typeof imageId !== 'undefined') {
      record.image = imageId ? await this.storageService.findOne(imageId) : null
    }

    await this.repository.getEntityManager().persistAndFlush(record)

    if (typeof tags !== 'undefined') {
      await this.setTags(record, tags)
    }
  }

  async remove(id: number) {
    const record = await this.repository.findOneOrFail({ id })
    await this.repository.getEntityManager().removeAndFlush(record)
  }

  async setTags(record: BlogPost, tagNames: string[]) {
    const tags: BlogTag[] = []
    for (const tagName of tagNames) {
      let tag = await this.blogTagService.findOneByName(tagName)
      if (!tag) {
        tag = await this.blogTagService.create({ name: tagName })
      }
      tags.push(tag)
    }
    record.tags.set(tags)
    await this.repository.getEntityManager().persistAndFlush(record)
  }
}

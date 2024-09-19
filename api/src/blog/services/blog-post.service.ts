import { EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { BlogPostCreateDto, BlogPostFindAllDto, BlogPostUpdateDto } from '../dto/blog-post.dto'
import { BlogPost } from '../entities/blog-post.entity'
import { StorageService } from '@/storage/services/storage.service'
import { BlogTag } from '../entities/blog-tag.entity'
import { slugify } from '@/lib/utils'

@Injectable()
export class BlogPostService {
  constructor(
    private storageService: StorageService,
    @InjectRepository(BlogPost)
    private repository: EntityRepository<BlogPost>
  ) {}

  async create({ imageId, tags, ...fillable }: BlogPostCreateDto) {
    const record = this.repository.create(fillable)

    if (typeof imageId !== 'undefined') {
      record.image = imageId ? await this.storageService.findOne(imageId) : null
    }

    if (typeof tags !== 'undefined') {
      await this.setTags(record, tags)
    }

    await this.repository.getEntityManager().persistAndFlush(record)

    return record
  }

  async findAll(dto: BlogPostFindAllDto) {
    let where: ObjectQuery<BlogPost> = {}
    if (dto.query) {
      where = { ...where, title: { $like: '%' + dto.query + '%' } }
    }
    const [rows, total] = await this.repository.findAndCount(where, {
      limit: dto.take,
      offset: dto.skip,
      orderBy: { [dto.sort]: dto.dir }
    })
    return { rows, total }
  }

  async findOne(id: number) {
    return this.repository.findOneOrFail({ id })
  }

  async update(id: number, { imageId, tags, ...fillable }: BlogPostUpdateDto) {
    const record = await this.repository.findOneOrFail(id)

    this.repository.assign(record, fillable)

    if (typeof imageId !== 'undefined') {
      record.image = imageId ? await this.storageService.findOne(imageId) : null
    }

    if (typeof tags !== 'undefined') {
      await this.setTags(record, tags)
    }

    await this.repository.getEntityManager().persistAndFlush(record)
  }

  async remove(id: number) {
    const record = await this.repository.findOneOrFail({ id })
    await this.repository.getEntityManager().removeAndFlush(record)
  }

  async setTags(record: BlogPost, tagNames: string[]) {
    const tags = await Promise.all(
      tagNames.map(async (tagName) => {
        const em = this.repository.getEntityManager()
        let tag = await em.findOne(BlogTag, { name: tagName })
        if (!tag) {
          tag = em.create(BlogTag, { name: tagName, alias: slugify(tagName) })
          em.persist(tag)
          // tag = new BlogTag()
          // tag.name = tagName
          // await em.persistAndFlush(tag)
        }
        return tag
      })
    )
    record.tags.set(tags)
  }
}

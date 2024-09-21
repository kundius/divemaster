import { EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'
import { BlogTag } from '../entities/blog-tag.entity'
import { slugify } from '@/lib/utils'
import { BlogPost } from '../entities/blog-post.entity'

@Injectable()
export class BlogTagService {
  constructor(
    @InjectRepository(BlogTag)
    private repository: EntityRepository<BlogTag>
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

  async create({ alias, ...fillable }: BlogTagCreateDto) {
    const record = new BlogTag()

    this.repository.assign(record, fillable)

    record.alias = await this.makeUniqueAlias(alias || fillable.name)

    await this.repository.getEntityManager().persistAndFlush(record)

    return record
  }

  async findAll(dto: BlogTagFindAllDto) {
    const qb = this.repository.createQueryBuilder('tag')

    if (dto.query) {
      qb.andWhere({ title: { $like: '%' + dto.query + '%' } })
    }

    const knex = this.repository.getEntityManager().getKnex()
    const qbPostsTotal = this.repository
      .getEntityManager()
      .createQueryBuilder(BlogPost, 'post')
      .where({ tags: knex.ref('tag.id') })
      .count('post.id', true)
      .as('posts_total')

    qb.select(['*', qbPostsTotal])
    qb.limit(dto.take)
    qb.offset(dto.skip)
    qb.orderBy({ [dto.sort]: dto.dir })

    const [rows, total] = await qb.getResultAndCount()

    return { rows, total }
  }

  async findOne(id: number) {
    return this.repository.findOneOrFail({ id })
  }

  async findOneByName(name: string) {
    return this.repository.findOne({ name })
  }

  async update(id: number, { alias, ...fillable }: BlogTagUpdateDto) {
    const record = await this.repository.findOneOrFail(id)

    this.repository.assign(record, fillable)

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      record.alias = await this.makeUniqueAlias(alias || record.name)
    }

    await this.repository.getEntityManager().persistAndFlush(record)
  }

  async remove(id: number) {
    const record = await this.repository.findOneOrFail({ id })
    await this.repository.getEntityManager().removeAndFlush(record)
  }
}

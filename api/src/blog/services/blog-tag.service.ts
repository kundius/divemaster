import { EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'
import { BlogTag } from '../entities/blog-tag.entity'
import { slugify } from '@/lib/utils'

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
    let where: ObjectQuery<BlogTag> = {}
    if (dto.query) {
      where = { ...where, name: { $like: '%' + dto.query + '%' } }
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

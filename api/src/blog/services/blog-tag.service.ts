import { EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'

import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'
import { BlogTag } from '../entities/blog-tag.entity'

@Injectable()
export class BlogTagService {
  constructor(
    @InjectRepository(BlogTag)
    private repository: EntityRepository<BlogTag>
  ) {}

  async create({ ...fillable }: BlogTagCreateDto) {
    const record = new BlogTag()

    this.repository.assign(record, fillable)

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

  async update(id: number, { ...fillable }: BlogTagUpdateDto) {
    const record = await this.repository.findOneOrFail(id)

    this.repository.assign(record, fillable)

    await this.repository.getEntityManager().persistAndFlush(record)
  }

  async remove(id: number) {
    const record = await this.repository.findOneOrFail({ id })
    await this.repository.getEntityManager().removeAndFlush(record)
  }
}

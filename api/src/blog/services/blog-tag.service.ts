import { slugify } from '@/lib/utils'
import { Injectable } from '@nestjs/common'
import { BlogTagCreateDto, BlogTagFindAllDto, BlogTagUpdateDto } from '../dto/blog-tag.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'
import { BlogTag } from '../entities/blog-tag.entity'

@Injectable()
export class BlogTagService {
  constructor(
    @InjectRepository(BlogTag)
    private blogTagRepository: Repository<BlogTag>
  ) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.blogTagRepository.findOne({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ alias, metadata, ...fillable }: BlogTagCreateDto) {
    const record = new BlogTag()

    this.blogTagRepository.merge(record, fillable)

    record.alias = await this.makeAlias(alias || fillable.name, true)

    await this.blogTagRepository.save(record)

    return record
  }

  // TODO добавить количество постов
  async findAll(dto: BlogTagFindAllDto) {
    const where: FindOptionsWhere<BlogTag> = {}
    const relations: FindOptionsRelations<BlogTag> = {}

    if (dto.query) {
      where.name = Like(`%${dto.query}%`)
    }

    const [rows, total] = await this.blogTagRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOne(id: number) {
    return this.blogTagRepository.findOneOrFail({ where: { id } })
  }

  async findOneByAlias(alias: string) {
    return this.blogTagRepository.findOneOrFail({ where: { alias } })
  }

  async findOneByName(name: string) {
    return this.blogTagRepository.findOneOrFail({ where: { name } })
  }

  async update(id: number, { alias, ...fillable }: BlogTagUpdateDto) {
    const record = await this.blogTagRepository.findOneOrFail({
      where: { id }
    })

    this.blogTagRepository.merge(record, fillable)

    if (typeof alias !== 'undefined' && alias !== record.alias) {
      record.alias = await this.makeAlias(alias || record.name, true)
    }

    await this.blogTagRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.blogTagRepository.delete({ id })
  }

  async findOrCreateTagsByName(names: string[]) {
    return Promise.all(
      names.map(async (name) => {
        const alias = await this.makeAlias(name)
        let record = await this.blogTagRepository.findOneBy({ alias })
        if (record) {
          record.name = name
        } else {
          record = new BlogTag()
          record.name = name
          record.alias = alias
        }
        await this.blogTagRepository.save(record)
        return record
      })
    )
  }
}

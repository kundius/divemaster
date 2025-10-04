import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'
import { CreateBrandDto, FindAllBrandQueryDto, UpdateBrandDto } from '../dto/brands.dto'
import { Brand } from '../entities/brand.entity'
import { slugify } from '@/lib/utils'

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) {}

  async makeAlias(from: string, unique: boolean = false) {
    let alias = slugify(from)

    if (unique) {
      const fn = async (n: number) => {
        const tmp = n !== 0 ? `${alias}-${n}` : alias
        const record = await this.brandRepository.findOne({
          where: { alias: tmp }
        })
        return record ? fn(n + 1) : tmp
      }
      alias = await fn(0)
    }

    return alias
  }

  async create({ imageId, ...fillable }: CreateBrandDto) {
    const record = new Brand()

    this.brandRepository.merge(record, fillable)

    if (typeof imageId !== 'undefined') {
      record.imageId = imageId
    }

    await this.brandRepository.save(record)

    return record
  }

  async findAll(dto: FindAllBrandQueryDto) {
    const where: FindOptionsWhere<Brand> = {}
    const relations: FindOptionsRelations<Brand> = {}

    if (dto.query) {
      where.name = Like(`%${dto.query}%`)
    }

    const [rows, total] = await this.brandRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOneByAlias(alias: string) {
    const where: FindOptionsWhere<Brand> = { alias }
    const record = await this.brandRepository.findOne({ where })
    return record
  }

  async findOne(id: number) {
    return this.brandRepository.findOneBy({ id })
  }

  async update(id: number, { imageId, ...fillable }: UpdateBrandDto) {
    const record = await this.brandRepository.findOneOrFail({
      where: { id }
    })

    this.brandRepository.merge(record, fillable)

    if (typeof imageId !== 'undefined') {
      record.imageId = imageId
    }

    await this.brandRepository.save(record)

    return record
  }

  async remove(id: number) {
    return this.brandRepository.delete({ id })
  }
}

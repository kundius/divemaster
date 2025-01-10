import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'
import { CreateBrandDto, FindAllBrandQueryDto, UpdateBrandDto } from '../dto/brands.dto'
import { Brand } from '../entities/brand.entity'

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>
  ) {}

  async create({ ...fillable }: CreateBrandDto) {
    const record = new Brand()

    this.brandRepository.merge(record, fillable)

    await this.brandRepository.save(record)

    return record
  }

  async findAll(dto: FindAllBrandQueryDto) {
    const where: FindOptionsWhere<Brand> = {}
    const relations: FindOptionsRelations<Brand> = {}

    if (dto.query) {
      where.title = Like(dto.query)
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

  async findOne(id: number) {
    return this.brandRepository.findOneBy({ id })
  }

  async update(id: number, { ...fillable }: UpdateBrandDto) {
    const record = await this.brandRepository.findOneOrFail({
      where: { id }
    })

    this.brandRepository.merge(record, fillable)

    await this.brandRepository.save(record)

    return record
  }

  async remove(id: number) {
    return this.brandRepository.delete({ id })
  }
}

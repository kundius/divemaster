import { EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { CreateBrandDto } from '../dto/create-brand.dto'
import { FindAllBrandQueryDto } from '../dto/find-all-brand-query.dto'
import { FindOneBrandQueryDto } from '../dto/find-one-brand-query.dto'
import { UpdateBrandDto } from '../dto/update-brand.dto'
import { Brand } from '../entities/brand.entity'

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: EntityRepository<Brand>
  ) {}

  async create({ ...fillable }: CreateBrandDto) {
    const brand = new Brand()

    this.brandsRepository.assign(brand, fillable)

    await this.brandsRepository.getEntityManager().persistAndFlush(brand)

    return brand
  }

  async findAll(query: FindAllBrandQueryDto) {
    const [rows, total] = await this.brandsRepository.findAndCount(query.where, query.options)
    return { rows, total }
  }

  async findOne(id: number, query?: FindOneBrandQueryDto) {
    return this.brandsRepository.findOneOrFail({ id }, query?.options)
  }

  async update(id: number, { ...fillable }: UpdateBrandDto) {
    const brand = await this.findOne(id)

    this.brandsRepository.assign(brand, fillable)

    await this.brandsRepository.getEntityManager().persistAndFlush(brand)
  }

  async remove(id: number) {
    const category = await this.brandsRepository.findOneOrFail({ id })
    await this.brandsRepository.getEntityManager().removeAndFlush(category)
  }
}

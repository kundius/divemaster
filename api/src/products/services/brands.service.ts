import { EntityRepository, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import { Brand } from '../entities/brand.entity'
import { CreateBrandDto, FindAllBrandQueryDto, UpdateBrandDto } from '../dto/brands.dto'

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

  async findAll(dto: FindAllBrandQueryDto) {
    let where: ObjectQuery<Brand> = {}
    if (dto.query) {
      where = { ...where, title: { $like: '%' + dto.query + '%' } }
    }
    const [rows, total] = await this.brandsRepository.findAndCount(where, {
      limit: dto.take,
      offset: dto.skip,
      orderBy: { [dto.sort]: dto.dir }
    })
    return { rows, total }
  }

  async findOne(id: number) {
    return this.brandsRepository.findOneOrFail({ id })
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

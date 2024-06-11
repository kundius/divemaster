import { EntityRepository } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import {
  CreateOptionDto,
  FindAllOptionQueryDto,
  FindOneOptionQueryDto,
  UpdateOptionDto
} from '../dto/options.dto'
import { Option } from '../entities/option.entity'

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: EntityRepository<Option>
  ) {}

  async create({ categories, ...fillable }: CreateOptionDto) {
    const option = new Option()

    this.optionsRepository.assign(option, fillable)

    if (typeof categories !== 'undefined') {
      console.log(categories)
    }

    await this.optionsRepository.getEntityManager().persistAndFlush(option)

    return option
  }

  async findAll(query: FindAllOptionQueryDto) {
    const [rows, total] = await this.optionsRepository.findAndCount(query.where, query.options)
    return { rows, total }
  }

  async findOne(id: number, query?: FindOneOptionQueryDto) {
    return this.optionsRepository.findOneOrFail({ id }, query?.options)
  }

  async update(id: number, { categories, ...fillable }: UpdateOptionDto) {
    const option = await this.findOne(id)

    this.optionsRepository.assign(option, fillable)

    if (typeof categories !== 'undefined') {
      console.log(categories)
    }

    await this.optionsRepository.getEntityManager().persistAndFlush(option)
  }

  async remove(id: number) {
    const option = await this.optionsRepository.findOneOrFail({ id })
    await this.optionsRepository.getEntityManager().removeAndFlush(option)
  }
}

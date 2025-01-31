import { Injectable } from '@nestjs/common'
import {
  CreateOptionDto,
  FindAllOptionCategoriesDto,
  FindAllOptionDto,
  FindOneOptionDto,
  UpdateOptionCategoriesDto,
  UpdateOptionDto
} from '../dto/options.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { FindOptionsRelations, FindOptionsWhere, Like, Repository } from 'typeorm'
import { Option } from '../entities/option.entity'
import { Category } from '../entities/category.entity'

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async create({ ...fillable }: CreateOptionDto) {
    const record = new Option()

    this.optionRepository.merge(record, fillable)

    await this.optionRepository.save(record)

    return record
  }

  async findAll(dto: FindAllOptionDto) {
    const where: FindOptionsWhere<Option> = {}
    const relations: FindOptionsRelations<Option> = {}

    if (dto.query) {
      where.caption = Like(`%${dto.query}%`)
    }

    const [rows, total] = await this.optionRepository.findAndCount({
      where,
      relations,
      order: { [dto.sort]: dto.dir },
      skip: dto.skip,
      take: dto.take
    })

    return { rows, total }
  }

  async findOne(id: number, dto?: FindOneOptionDto) {
    return this.optionRepository.findOneByOrFail({ id })
  }

  async update(id: number, { ...fillable }: UpdateOptionDto) {
    const record = await this.optionRepository.findOneByOrFail({ id })

    this.optionRepository.merge(record, fillable)

    await this.optionRepository.save(record)

    return record
  }

  async remove(id: number) {
    await this.optionRepository.delete({ id })
  }

  async findAllCategories(optionId: number, query?: FindAllOptionCategoriesDto) {
    const record = await this.optionRepository.findOneOrFail({
      where: { id: optionId },
      relations: {
        categories: true
      }
    })
    return record.categories
  }

  async updateCategories(id: number, { categories }: UpdateOptionCategoriesDto) {
    const record = await this.optionRepository.findOneOrFail({
      where: { id },
      relations: {
        categories: true
      }
    })

    record.categories = await Promise.all(
      categories.map(async (cat) => this.categoryRepository.findOneByOrFail({ id: +cat }))
    )

    await this.optionRepository.save(record)

    return record.categories
  }

  async findAllValues(optionId: number) {
    // TODO: make query builder and group by
    const record = await this.optionRepository.findOneOrFail({
      where: { id: optionId },
      relations: { values: true }
    })
    const contents = record.values.map((item) => item.content)
    const values = contents.filter((v, i, a) => a.indexOf(v) === i)
    return values
  }
}

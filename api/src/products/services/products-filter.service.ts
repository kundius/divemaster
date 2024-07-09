import { EntityRepository, FilterQuery, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { isArray, isBoolean, isNull, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { Injectable } from '@nestjs/common'
import { Option, OptionType } from '../entities/option.entity'
import { Product } from '../entities/product.entity'

export interface BaseFilter {
  name: string
  title: string
}

export interface OptionsFilter extends BaseFilter {
  type: 'options'
  variant: 'default' | 'colors'
  conjunction: boolean
  options: {
    value: string
    amount: number
  }[]
}

export interface RangeFilter extends BaseFilter {
  type: 'range'
  range: [number | undefined, number | undefined]
}

export interface ToggleFilter extends BaseFilter {
  type: 'toggle'
}

export type Filter = OptionsFilter | RangeFilter | ToggleFilter

export type DataRecord = Record<string, string | number | boolean | string[]>
export type SelectedRecord = Record<string, string | number | boolean | string[] | [number, number]>

@Injectable()
export class ProductsFilterService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: EntityRepository<Option>,
    @InjectRepository(Product)
    private productsRepository: EntityRepository<Product>
  ) {}

  filters: Filter[] = []
  data: DataRecord[] = []

  async init(categoryId?: number) {
    // определить фильтры
    this.filters = await this.loadFilters(categoryId)
    // загрузить товары
    this.data = await this.loadData(categoryId)
  }

  // типы полей должны соответствовать типам фильтра:
  // range: number
  // options: string[]
  // colors: string[]
  // toggle: boolean
  async loadData(categoryId?: number): Promise<DataRecord[]> {
    let where: ObjectQuery<Product> = {
      active: true
    }
    if (categoryId) {
      where = { ...where, categories: { $in: [categoryId] } }
    }
    const products = await this.productsRepository.find(where, {
      populate: ['brand', 'optionVariants', 'optionVariants.option']
    })

    const data: DataRecord[] = []
    for (const product of products) {
      const record: DataRecord = {
        id: product.id,
        title: product.title,
        price: product.price,
        inStock: product.inStock,
        recent: product.recent,
        favorite: product.favorite
      }

      if (product.brand) {
        record.brand = [product.brand.title]
      }

      for (const variant of product.optionVariants) {
        const field = record[variant.option.key]
        if (isArray(field)) {
          field.push(variant.value)
        } else {
          record[variant.option.key] = [variant.value]
        }
      }

      data.push(record)
    }

    return data
  }

  // по умолчанию фильтры имеют не заполненные варианты
  async loadFilters(categoryId?: number): Promise<Filter[]> {
    let where: ObjectQuery<Option> = {}
    if (categoryId) {
      where = { ...where, categories: { $in: [categoryId] } }
    }
    const options = await this.optionsRepository.find(where)
    const filters: Filter[] = []
    filters.push({
      type: 'toggle',
      title: 'recent',
      name: 'recent'
    })
    filters.push({
      type: 'range',
      title: 'Цена',
      name: 'price',
      range: [undefined, undefined]
    })
    filters.push({
      type: 'options',
      variant: 'default',
      title: 'Бренд',
      name: 'brand',
      conjunction: true,
      options: []
    })
    for (const option of options) {
      const base = { title: option.caption, name: option.key, option }
      switch (option.type) {
        case OptionType.BOOLEAN:
          filters.push({ ...base, type: 'toggle' })
          break
        default:
          filters.push({
            ...base,
            type: 'options',
            conjunction: false,
            options: [],
            variant: option.type === OptionType.COLOR ? 'colors' : 'default'
          })
          break
      }
    }
    return filters
  }

  async search(selected: SelectedRecord): Promise<number[]> {
    // отфильтровать товары и наполнить фильтры опциями
    const selectedProducts = this.data.filter((row) => {
      // фильтрация с учетом типов фильтров
      const matches: { [key in keyof typeof selected]: boolean } = {}
      for (const [key, value] of Object.entries(selected)) {
        const field = row[key]
        const filter = this.filters.find((item) => item.name === key)

        if (!filter) {
          matches[key] = false
          continue
        }

        if (filter.type === 'range' && isNumber(field) && isArray(value, isNumber)) {
          matches[key] = field >= value[0] && field <= value[1]
          continue
        }

        if (filter.type === 'options' && isArray(field, isString) && isArray(value, isString)) {
          matches[key] = value[filter.conjunction ? 'every' : 'some'](
            (str) => field && field.includes(str)
          )
          continue
        }

        if (filter.type === 'toggle' && isBoolean(field) && isBoolean(value)) {
          matches[key] = !value || value === field
          continue
        }

        matches[key] = false
      }

      const matched = Object.values(matches).every((match) => match === true)

      // наполнение фильров значениями
      for (const key of Object.keys(row)) {
        const field = row[key]
        const filter = this.filters.find((item) => item.name === key)

        if (!filter) continue

        // подсчет мин. и мак. значения для range фильтра
        // поле должно быть числом
        // товар должен удовлетворять условиям фильтра
        if (filter.type === 'range' && isNumber(field)) {
          const matchedForToggle = Object.keys(matches)
            .filter((matchKey) => matchKey !== key)
            .map((matchKey) => matches[matchKey])
            .every((match) => match === true)
          if (matchedForToggle) {
            if (isUndefined(filter.range[0]) || field < filter.range[0]) {
              filter.range[0] = field
            }
            if (isUndefined(filter.range[1]) || field > filter.range[1]) {
              filter.range[1] = field
            }
          }
        }

        // подбор вариантов для options фильтра
        // подсчет количество товаров для каждого варианта, удовлетворяющих условия фильтра
        if (filter.type === 'options' && isArray(field, isString)) {
          const matchedForOptions = Object.keys(matches)
            .filter((matchKey) => matchKey !== key || filter.conjunction)
            .map((matchKey) => matches[matchKey])
            .every((match) => match === true)
          for (const fieldOption of field) {
            const filterOption = filter.options.find((item) => item.value === fieldOption)
            if (!filterOption) {
              filter.options.push({
                value: fieldOption,
                amount: Number(matchedForOptions)
              })
            } else {
              filterOption.amount += Number(matchedForOptions)
            }
          }
        }
      }

      return matched
    })

    return selectedProducts.map((item) => Number(item.id))
  }
}

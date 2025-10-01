import { isArray, isBoolean, isNull, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from '../entities/product.entity'
import { FindOptionsWhere, Repository } from 'typeorm'
import { Property, PropertyType } from '../entities/property.entity'

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
    quantity: number
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

export type DataRecord = Record<string, string | number | boolean | string[] | number[]>
export type SelectedRecord = Record<string, string | number | boolean | string[] | [number, number]>

@Injectable()
export class ProductsFilterService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>
  ) {}

  filters: Filter[] = []
  data: DataRecord[] = []

  async init(where: FindOptionsWhere<Product>) {
    // определить фильтры
    this.filters = await this.loadFilters(where)
    // загрузить товары
    this.data = await this.loadData(where)
  }

  // типы полей должны соответствовать типам фильтра:
  // range: number
  // options: string[]
  // colors: string[]
  // toggle: boolean
  async loadData(where: FindOptionsWhere<Product>): Promise<DataRecord[]> {
    const products = await this.productRepository.find({
      where,
      relations: {
        brand: true,
        options: true,
        offers: true
      }
    })

    const data: DataRecord[] = []
    for (const product of products) {
      const record: DataRecord = {
        id: product.id,
        title: product.title,
        price: product.offers.map((offer) => offer.price),
        inStock: product.inStock,
        recent: product.recent,
        favorite: product.favorite
      }

      if (product.brand) {
        record.brand = [product.brand.title]
      }

      for (const productOption of product.options) {
        const property = await this.propertyRepository.findOne({
          where: { key: productOption.name }
        })

        // этой опции больше не существует, пропускаем
        if (!property) continue

        switch (property.type) {
          case PropertyType.TEXTFIELD:
            // case OptionType.TEXTAREA:
            // case OptionType.COMBOBOX:
            record[property.key] = productOption.content
            break
          case PropertyType.COMBOBOOLEAN:
            record[property.key] = productOption.content === '1'
            break
          case PropertyType.NUMBERFIELD:
            record[property.key] = Number(productOption.content)
            break
          case PropertyType.COMBOCOLORS:
          case PropertyType.COMBOOPTIONS:
            const field = record[property.key]
            if (isArray(field, isString)) {
              field.push(productOption.content)
            } else {
              record[property.key] = [productOption.content]
            }
            break
        }
      }

      data.push(record)
    }

    return data
  }

  // по умолчанию фильтры имеют не заполненные варианты
  async loadFilters(where: FindOptionsWhere<Product>): Promise<Filter[]> {
    const properties = await this.propertyRepository.find({
      where: {
        categories: where.categories
      },
      order: { rank: 'asc' }
    })

    const filters: Filter[] = []
    filters.push({
      type: 'toggle',
      title: 'Новинка',
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
    for (const roperty of properties) {
      const base = { title: roperty.caption, name: roperty.key, option: roperty }
      switch (roperty.type) {
        // case OptionType.TEXTAREA:
        //   // не фильтруется
        //   break
        case PropertyType.TEXTFIELD:
          // case OptionType.COMBOBOX:
          filters.push({
            ...base,
            type: 'options',
            conjunction: false,
            options: [],
            variant: 'default'
          })
          break
        case PropertyType.COMBOBOOLEAN:
          filters.push({ ...base, type: 'toggle' })
          break
        case PropertyType.NUMBERFIELD:
          filters.push({ ...base, type: 'range', range: [undefined, undefined] })
          break
        case PropertyType.COMBOCOLORS:
        case PropertyType.COMBOOPTIONS:
          filters.push({
            ...base,
            type: 'options',
            conjunction: false,
            options: [],
            variant: roperty.type === PropertyType.COMBOCOLORS ? 'colors' : 'default'
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

        if (filter.type === 'range' && isArray(value, isNumber)) {
          if (isArray(field, isNumber)) {
            matches[key] = field.some((f) => f >= value[0] && f <= value[1])
            continue
          }
          if (isNumber(field)) {
            matches[key] = field >= value[0] && field <= value[1]
            continue
          }
        }

        if (filter.type === 'options' && isArray(value, isString) && isString(field)) {
          matches[key] = value[filter.conjunction ? 'every' : 'some'](
            (str) => field && field === str
          )
          continue
        }

        if (filter.type === 'options' && isArray(value, isString) && isArray(field, isString)) {
          matches[key] = value[filter.conjunction ? 'every' : 'some'](
            (str) => field && field.includes(str)
          )
          continue
        }

        if (filter.type === 'toggle' && isBoolean(value) && isBoolean(field)) {
          matches[key] = !value || value === field
          continue
        }

        matches[key] = false
      }

      const matched = Object.values(matches).every((match) => match === true)

      // наполнение фильтров значениями
      for (const key of Object.keys(row)) {
        const field = row[key]
        const filter = this.filters.find((item) => item.name === key)

        if (!filter) continue

        // подсчет мин. и макс. значения для range фильтра
        // поле должно быть числом или массивом чисел
        // товар должен удовлетворять условиям фильтра
        if (filter.type === 'range' && (isNumber(field) || isArray(field, isNumber))) {
          const matchedForToggle = Object.keys(matches)
            .filter((matchKey) => matchKey !== key)
            .map((matchKey) => matches[matchKey])
            .every((match) => match === true)
          if (matchedForToggle) {
            const fieldNumbers = isNumber(field) ? [field] : field
            for (const fieldNumber of fieldNumbers) {
              if (isUndefined(filter.range[0]) || fieldNumber < filter.range[0]) {
                filter.range[0] = fieldNumber
              }
              if (isUndefined(filter.range[1]) || fieldNumber > filter.range[1]) {
                filter.range[1] = fieldNumber
              }
            }
          }
        }

        // подбор вариантов для options фильтра
        // подсчет количество товаров для каждого варианта, удовлетворяющих условия фильтра
        if (filter.type === 'options' && (isString(field) || isArray(field, isString))) {
          const matchedForOptions = Object.keys(matches)
            .filter((matchKey) => matchKey !== key || filter.conjunction)
            .map((matchKey) => matches[matchKey])
            .every((match) => match === true)
          const fieldOptions = isString(field) ? [field] : field
          for (const fieldOption of fieldOptions) {
            const filterOption = filter.options.find((item) => item.value === fieldOption)
            if (!filterOption) {
              filter.options.push({
                value: fieldOption,
                quantity: Number(matchedForOptions)
              })
            } else {
              filterOption.quantity += Number(matchedForOptions)
            }
          }
        }
      }

      return matched
    })

    return selectedProducts.map((item) => Number(item.id))
  }
}

import { isArray, isBoolean, isNull, isNumber, isString, isUndefined } from '@modyqyw/utils'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma.service'
import { $Enums, Prisma } from '@prisma/client'

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
    private readonly prismaService: PrismaService
    // @InjectRepository(Option)
    // private optionsRepository: EntityRepository<Option>,
    // @InjectRepository(Product)
    // private productsRepository: EntityRepository<Product>
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
    // TODO: HIERARCHY_DEPTH_LIMIT
    const products = await this.prismaService.product.findMany({
      where: {
        categories: categoryId
          ? {
              some: {
                category_id: categoryId
              }
            }
          : undefined
      },
      include: {
        brand: true,
        optionValues: {
          include: {
            option: true
          }
        },
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

      for (const value of product.optionValues) {
        switch (value.option.type) {
          case $Enums.OptionType.textfield:
            // case OptionType.TEXTAREA:
            // case OptionType.COMBOBOX:
            record[value.option.key] = value.content
            break
          case $Enums.OptionType.combo_boolean:
            record[value.option.key] = value.content === '1'
            break
          case $Enums.OptionType.numberfield:
            record[value.option.key] = Number(value.content)
            break
          case $Enums.OptionType.combo_colors:
          case $Enums.OptionType.combo_options:
            const field = record[value.option.key]
            if (isArray(field, isString)) {
              field.push(value.content)
            } else {
              record[value.option.key] = [value.content]
            }
            break
        }
      }

      data.push(record)
    }

    return data
  }

  // по умолчанию фильтры имеют не заполненные варианты
  async loadFilters(categoryId?: number): Promise<Filter[]> {
    // TODO: HIERARCHY_DEPTH_LIMIT
    const options = await this.prismaService.option.findMany({
      where: {
        categories: categoryId
          ? {
              some: {
                category_id: categoryId
              }
            }
          : undefined
      },
      orderBy: {
        rank: 'asc'
      }
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
    for (const option of options) {
      const base = { title: option.caption, name: option.key, option }
      switch (option.type) {
        // case OptionType.TEXTAREA:
        //   // не фильтруется
        //   break
        case $Enums.OptionType.textfield:
          // case OptionType.COMBOBOX:
          filters.push({
            ...base,
            type: 'options',
            conjunction: false,
            options: [],
            variant: 'default'
          })
          break
        case $Enums.OptionType.combo_boolean:
          filters.push({ ...base, type: 'toggle' })
          break
        case $Enums.OptionType.numberfield:
          filters.push({ ...base, type: 'range', range: [undefined, undefined] })
          break
        case $Enums.OptionType.combo_colors:
        case $Enums.OptionType.combo_options:
          filters.push({
            ...base,
            type: 'options',
            conjunction: false,
            options: [],
            variant: option.type === $Enums.OptionType.combo_colors ? 'colors' : 'default'
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

      // наполнение фильров значениями
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

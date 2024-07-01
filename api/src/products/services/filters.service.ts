import { EntityRepository, FilterQuery, ObjectQuery } from '@mikro-orm/mariadb'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Injectable } from '@nestjs/common'
import {
  CreateOptionDto,
  FindAllOptionCategoriesDto,
  FindAllOptionDto,
  FindOneOptionDto,
  UpdateOptionCategoriesDto,
  UpdateOptionDto
} from '../dto/options.dto'
import { Option } from '../entities/option.entity'
import { Category } from '../entities/category.entity'
import { OptionVariant } from '../entities/option-variant.entity'
import { Product } from '../entities/product.entity'
const itemsjs = require('itemsjs');
import { FiltersJS, Operation } from "filtersjs"

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Option)
    private optionsRepository: EntityRepository<Option>,
    @InjectRepository(OptionVariant)
    private optionVariantsRepository: EntityRepository<OptionVariant>,
    @InjectRepository(Category)
    private categoryRepository: EntityRepository<Category>,
    @InjectRepository(Product)
    private productsRepository: EntityRepository<Product>,
  ) {}

  async findAll(categoryId: number) {
    const [rows, total] = await this.productsRepository.findAndCount({
      active: true,
      categories: {
        $in: [categoryId]
      }
    }, {
      populate: ['brand']
    })

    const data: Record<string, any>[] = []

    for (const row of rows) {
      const record: Record<string, any> = {
        id: row.id,
        price: row.price,
        title: row.title,
        active: row.active,
        inStock: row.inStock,
        recent: row.recent,
        favorite: row.favorite,
        brand: row.brand?.title,
      }
      data.push(record)
    }

    const configuration = {
      aggregations: {
        brand: {
          title: 'Бренд',
          size: 10,
          conjunction: false
        },
        price: {
          title: 'Цена',
          conjunction: false,
          sort: 'key',
          order: 'asc',
          size: 1,
          show_facet_stats: true,
          chosen_filters_on_top: false,
          hide_zero_doc_count: true
        }
      },
      searchableFields: ['title'],
    }
    const searchEngine = itemsjs(data, configuration)
    return searchEngine.search({
      // per_page: 3,
      // filters: {
      //   brand: ['Бренд 2']
      // },
      query: 'a',
      filter: function(item) {
        return item.price >= 10101 && item.price <= 800000;
      }
    })
  }
}

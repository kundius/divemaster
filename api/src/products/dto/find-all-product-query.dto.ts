import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Product } from '../entities/product.entity'
import { FilterQuery } from '@mikro-orm/core'

export class FindAllProductQueryDto extends PaginationQueryDto<Product> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly category?: number

  get where() {
    const where: FilterQuery<Product> = {}
    if (this.query) {
      where.title = {
        $like: '%' + this.query + '%'
      }
    }
    if (typeof this.category !== 'undefined') {
      // TODO: HIERARCHY_DEPTH_LIMIT
      // товары выбираются без учета подкатегорий
      where.categories = {
        $some: {
          $or: [
            {
              id: this.category
            }
            // {
            //   parent: this.category
            // }
          ]
        }
      }
    }
    return where
  }
}

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { Product } from '../entities/product.entity'
import { FilterQuery } from '@mikro-orm/core'

export class FindAllProductQueryDto extends PaginationQueryDto<Product> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  get where() {
    const where: FilterQuery<Product> = {}
    if (this.query) {
      where.title = {
        $like: '%' + this.query + '%'
      }
    }
    return where
  }
}

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { FilterQuery } from '@mikro-orm/core'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { Brand } from '../entities/brand.entity'
import { Category } from '../entities/category.entity'

export class FindAllBrandQueryDto extends PaginationQueryDto<Brand> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  get where() {
    const where: FilterQuery<Category> = {}
    if (this.query) {
      where.title = {
        $like: '%' + this.query + '%'
      }
    }
    return where
  }
}

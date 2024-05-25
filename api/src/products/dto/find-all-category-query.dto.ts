import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { Category } from '../entities/category.entity'
import { FilterQuery } from '@mikro-orm/core'

export class FindAllCategoryQueryDto extends PaginationQueryDto<Category> {
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

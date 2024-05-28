import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Category } from '../entities/category.entity'
import { FilterQuery } from '@mikro-orm/core'

export class FindAllCategoryQueryDto extends PaginationQueryDto<Category> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly parent?: number

  get where() {
    const where: FilterQuery<Category> = {}
    if (this.query) {
      where.title = {
        $like: '%' + this.query + '%'
      }
    }
    if (typeof this.parent !== 'undefined') {
      where.parent = this.parent
    }
    return where
  }
}

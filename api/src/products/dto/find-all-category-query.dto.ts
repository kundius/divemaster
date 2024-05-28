import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Transform, Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
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

  @Transform(({ value }) => !['0', 'false'].includes(value))
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean

  get where() {
    const where: FilterQuery<Category> = {}
    if (this.query) {
      where.title = {
        $like: '%' + this.query + '%'
      }
    }
    if (typeof this.parent !== 'undefined') {
      where.parent = this.parent === 0 ? null : this.parent
    }
    if (typeof this.active !== 'undefined') {
      where.active = this.active
    }
    return where
  }
}

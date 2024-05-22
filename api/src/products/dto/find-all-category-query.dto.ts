import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { FindOptionsWhere, Like } from 'typeorm'
import { Category } from '../entities/category.entity'

export class FindAllCategoryQueryDto extends PaginationQueryDto<Category> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  get where() {
    const where: FindOptionsWhere<Category> = {}
    if (this.query) {
      where.title = Like('%' + this.query + '%')
    }
    return where
  }
}

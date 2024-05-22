import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { FindOptionsWhere, Like } from 'typeorm'
import { Product } from '../entities/product.entity'

export class FindAllProductQueryDto extends PaginationQueryDto<Product> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  get where() {
    const where: FindOptionsWhere<Product> = {}
    if (this.query) {
      where.title = Like('%' + this.query + '%')
    }
    return where
  }
}

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { User } from '../entities/user.entity'
import { FilterQuery } from '@mikro-orm/core'

export class FindAllUserQueryDto extends PaginationQueryDto<User> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  get where() {
    const where: FilterQuery<User> = {}
    if (this.query) {
      where.name = {
        $like: '%' + this.query + '%'
      }
    }
    return where
  }
}

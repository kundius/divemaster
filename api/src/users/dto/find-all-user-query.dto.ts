import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { FindOptionsWhere, Like } from 'typeorm'
import { User } from '../entities/user.entity'

export class FindAllUserQueryDto extends PaginationQueryDto<User> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  get where() {
    const where: FindOptionsWhere<User> = {}
    if (this.query) {
      where.name = Like('%' + this.query + '%')
    }
    return where
  }
}

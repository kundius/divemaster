import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'
import { Role } from '../entities/role.entity'
import { FilterQuery, raw } from '@mikro-orm/core'

export class FindAllRoleQueryDto extends PaginationQueryDto<Role> {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly scope?: string[]

  get where() {
    const where: FilterQuery<Role> = {}
    if (this.query) {
      where.title = {
        $like: '%' + this.query + '%'
      }
    }
    if (this.scope) {
      where[raw(`JSON_CONTAINS(scope, '${JSON.stringify(this.scope)}', '$')`)] = 1
    }
    return where
  }
}

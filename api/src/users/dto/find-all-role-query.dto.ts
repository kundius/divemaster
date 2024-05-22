import { JsonArrayContains } from '@/lib/json-array-contains'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'
import { FindOptionsWhere, Like } from 'typeorm'
import { Role } from '../entities/role.entity'

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
    const where: FindOptionsWhere<Role> = {}
    if (this.query) {
      where.title = Like('%' + this.query + '%')
    }
    if (this.scope) {
      where.scope = JsonArrayContains(this.scope)
    }
    return where
  }
}

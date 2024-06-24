import { Transform, Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Role } from '../entities/role.entity'
import { FilterQuery, QueryOrder, raw } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'

export class CreateRoleDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => Array)
  @IsArray()
  @IsOptional()
  scope?: string[]
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class FindAllRoleQueryDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly scope?: string[]

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Role = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC
}

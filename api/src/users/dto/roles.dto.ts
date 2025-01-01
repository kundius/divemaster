import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { PartialType } from '@nestjs/mapped-types'
import { Role } from '@prisma/client'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

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

  @IsString()
  @IsOptional()
  dir: 'asc' | 'desc' = 'asc'
}

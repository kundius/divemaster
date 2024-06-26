import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { QueryOrder } from '@mikro-orm/core'
import { Category } from '../entities/category.entity'
import { PartialType } from '@nestjs/mapped-types'

export class CreateCategoryDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  alias: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  parentId?: number | null

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  imageId?: number | null
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class FindAllCategoryQueryDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly parent?: number

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withChildren: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withContent: boolean = false

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Category = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC
}

export class FindOneCategoryQueryDto {}

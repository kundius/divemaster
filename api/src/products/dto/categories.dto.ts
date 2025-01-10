import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { Category } from '../entities/category.entity'

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
  rank?: number

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
  withParent: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withContent: boolean = false

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Category = 'id'

  @IsString()
  @IsOptional()
  dir: 'asc' | 'desc' = 'asc'
}

export class FindOneCategoryQueryDto {
  @Type(() => Boolean)
  @IsBoolean()
  active: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withChildren: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withParent: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withContent: boolean = false
}

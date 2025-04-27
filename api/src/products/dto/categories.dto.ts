import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'
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
  allowInactive: boolean = false

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Category = 'rank'

  @IsString()
  @IsOptional()
  dir: 'ASC' | 'DESC' = 'ASC'
}

export class FindOneCategoryQueryDto {
  @Type(() => Boolean)
  @IsBoolean()
  allowInactive: boolean = false
}

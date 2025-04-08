import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Property, PropertyType } from '../entities/property.entity'

export class CreatePropertyDto {
  @Type(() => String)
  @IsString()
  key: string

  @Type(() => String)
  @IsString()
  caption: string

  @IsEnum(PropertyType)
  type: PropertyType

  @Type(() => Boolean)
  @IsBoolean()
  inFilter: boolean

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rank?: number
}

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {}

export class FindAllPropertyDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort: keyof Property = 'rank'

  @IsString()
  @IsOptional()
  readonly dir: 'asc' | 'desc' = 'asc'
}

export class FindOnePropertyDto {}

export class FindAllPropertyCategoriesDto {}

export class UpdatePropertyCategoriesDto {
  @IsArray()
  categories: Array<string>
}

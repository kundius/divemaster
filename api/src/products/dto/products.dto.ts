import { FindOneQueryDto } from '@/lib/find-one-query.dto'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Product } from '../entities/product.entity'
import { QueryOrder } from '@mikro-orm/core'

export class UpdateProductImageDto {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active?: boolean
}

export class UpdateProductCategoryDto {
  @IsArray()
  categories: Array<string>
}

export class SortProductImageDto {
  files: Record<string, number>
}

export class FindOneProductDto extends FindOneQueryDto<Product> {}

export class FindAllProductDto extends PaginationQueryDto<Product> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: string = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC

  @Type(() => String)
  @IsString()
  @IsOptional()
  query?: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  category?: number

  @Type(() => Boolean)
  @IsBoolean()
  withImages: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withContent: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withOptions: boolean = false
}

export class CreateProductDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  alias: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  sku?: string

  @Type(() => Number)
  @IsNumber()
  price: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  oldPrice: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  specifications?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  exploitation?: string

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean

  @Type(() => Boolean)
  @IsBoolean()
  recent: boolean

  @Type(() => Boolean)
  @IsBoolean()
  favorite: boolean

  @Type(() => Boolean)
  @IsBoolean()
  inStock: boolean

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  brandId?: number | null
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
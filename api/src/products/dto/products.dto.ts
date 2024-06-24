import { FindOneQueryDto } from '@/lib/find-one-query.dto'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
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
  includeImages: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  includeContent: boolean = false

  @Type(() => String)
  @IsString()
  sort: keyof Product = 'id'

  @IsEnum(QueryOrder)
  dir: QueryOrder = QueryOrder.ASC
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

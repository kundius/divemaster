import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseBoolean } from '@/lib/parse-boolean'
import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Product } from '../entities/product.entity'

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

export class FindOneProductDto {
  @ParseBoolean()
  @IsBoolean()
  active: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withOffers: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withImages: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withContent: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withOptions: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withBrand: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withCategories: boolean = false
}

export class FindAllProductDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  filter?: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  category?: number

  @ParseBoolean()
  @IsBoolean()
  active: boolean = false

  @ParseBoolean()
  @IsBoolean()
  favorite: boolean = false

  @ParseBoolean()
  @IsBoolean()
  recent: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withImages: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withContent: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withOptions: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withOffers: boolean = false

  @Type(() => Boolean)
  @IsBoolean()
  withBrand: boolean = false

  @ParseBoolean()
  @IsBoolean()
  withCategories: boolean = false

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Product = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC
}

export class CreateProductDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  alias: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rank?: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  sku?: string

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  priceDecrease: number

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

  @Type(() => ParseBoolean)
  @IsBoolean()
  active: boolean

  @Type(() => ParseBoolean)
  @IsBoolean()
  recent: boolean

  @Type(() => ParseBoolean)
  @IsBoolean()
  favorite: boolean

  @Type(() => ParseBoolean)
  @IsBoolean()
  inStock: boolean

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  brandId?: number | null
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export type UpdateProductOptions = Record<string, number | boolean | string | string[] | undefined>

export class CreateOfferDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  title: string

  @Type(() => Number)
  @IsNumber()
  price: number

  @Type(() => Array)
  @IsArray()
  optionValues: number[]
}

export class UpdateOfferDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  title: string

  @Type(() => Number)
  @IsNumber()
  price: number

  @Type(() => Array)
  @IsArray()
  optionValues: number[]
}

export class OrderByClickProductDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  name: string

  @Type(() => String)
  @IsString()
  phone: string

  @Type(() => String)
  @IsString()
  subject: string

  @ParseBoolean()
  @IsBoolean()
  approve: boolean = false
}

import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

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

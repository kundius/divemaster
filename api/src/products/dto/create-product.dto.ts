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

  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean
}
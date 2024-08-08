import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator'

export class AddProductDto {
  @Type(() => Number)
  @IsNumber()
  id: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number

  @Type(() => Array)
  @IsArray()
  optionValues?: number[]
}

export class UpdateProductDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number
}

export class TemporaryCreateOrderDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  customerPhone?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  customerEmail?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  customerName?: string
}

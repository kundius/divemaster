import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional } from 'class-validator'

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

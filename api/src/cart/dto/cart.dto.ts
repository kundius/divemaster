import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class AddProductDto {
  @Type(() => Number)
  @IsNumber()
  readonly id: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly amount?: number

  @IsOptional()
  readonly options?: Record<string, string>
}

export class UpdateProductDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly amount?: number
}

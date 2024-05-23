import { Type } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'

export class UpdateProductImageDto {
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  active?: boolean
}

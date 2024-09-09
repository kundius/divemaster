import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class FindAllPickupPointQueryDto {
  @Type(() => String)
  @IsString()
  region: string
}

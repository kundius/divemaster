import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class FindAllPickupPointQueryDto {
  @Type(() => String)
  @IsString()
  region: string
}

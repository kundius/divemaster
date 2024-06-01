import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class CreateBrandDto {
  @Type(() => String)
  @IsString()
  title: string
}

import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class CreateProductContentDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  content: string
}

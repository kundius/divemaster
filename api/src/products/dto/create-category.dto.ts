import { Type } from 'class-transformer'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  alias: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean

  @Type(() => Number)
  @IsNumber()
  parentId: number
}

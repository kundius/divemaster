import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Option, OptionType } from '../entities/option.entity'
import { FindOneQueryDto } from '@/lib/find-one-query.dto'

export class CreateOptionDto {
  @Type(() => String)
  @IsString()
  key: string

  @Type(() => String)
  @IsString()
  caption: string

  @IsEnum(OptionType)
  type: OptionType

  @Type(() => Boolean)
  @IsBoolean()
  inFilter: boolean

  @Type(() => Boolean)
  @IsBoolean()
  inCart: boolean

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rank?: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  properties?: string

  @IsArray()
  @IsOptional()
  categories?: Array<string>
}

export class UpdateOptionDto extends PartialType(CreateOptionDto) {}

export class FindAllOptionQueryDto extends PaginationQueryDto<Option> {}

export class FindOneOptionQueryDto extends FindOneQueryDto<Option> {}

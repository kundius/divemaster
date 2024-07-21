import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Option, OptionType } from '../entities/option.entity'

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

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rank?: number
}

export class UpdateOptionDto extends PartialType(CreateOptionDto) {}

export class FindAllOptionDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort: keyof Option = 'rank'

  @IsEnum(QueryOrder)
  @IsOptional()
  readonly dir: QueryOrder = QueryOrder.ASC
}

export class FindOneOptionDto {}

export class FindAllOptionCategoriesDto {}

export class UpdateOptionCategoriesDto {
  @IsArray()
  categories: Array<string>
}

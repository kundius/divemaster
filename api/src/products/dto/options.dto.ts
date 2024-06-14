import { FindAllQueryDto } from '@/lib/find-all-query.dto'
import { FindOneQueryDto } from '@/lib/find-one-query.dto'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Category } from '../entities/category.entity'
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

  @Type(() => Boolean)
  @IsBoolean()
  inCart: boolean

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  rank?: number
}

export class UpdateOptionDto extends PartialType(CreateOptionDto) {}

export class FindAllOptionDto extends PaginationQueryDto<Option> {
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

export class FindOneOptionDto extends FindOneQueryDto<Option> {}

export class FindAllOptionCategoriesDto extends FindAllQueryDto<Category> {}

export class UpdateOptionCategoriesDto {
  @IsArray()
  categories: Array<string>
}

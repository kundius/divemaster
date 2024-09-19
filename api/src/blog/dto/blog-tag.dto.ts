import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, IsJSON, IsObject } from 'class-validator'

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseJSONString } from '@/lib/parse-json-string'

import { BlogTag } from '../entities/blog-tag.entity'

export class BlogTagCreateDto {
  @Type(() => String)
  @IsString()
  name: string

  @Type(() => String)
  @IsString()
  alias: string

  @Type(() => ParseJSONString)
  @IsObject()
  @IsOptional()
  seo?: Record<string, string>
}

export class BlogTagUpdateDto extends PartialType(BlogTagCreateDto) {}

export class BlogTagFindAllDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof BlogTag = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC
}

export class BlogTagFindOneDto {}

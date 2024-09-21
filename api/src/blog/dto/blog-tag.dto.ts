import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, IsJSON, IsObject } from 'class-validator'

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseObject } from '@/lib/parse-object'

import { BlogTag } from '../entities/blog-tag.entity'

export class BlogTagCreateDto {
  @Type(() => String)
  @IsString()
  name: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  alias?: string

  @Type(() => ParseObject)
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>
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
  sort: keyof BlogTag = 'postsTotal'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.DESC
}

export class BlogTagFindOneDto {}

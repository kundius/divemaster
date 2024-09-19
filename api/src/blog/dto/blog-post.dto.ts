import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseBooleanString } from '@/lib/parse-boolean-string'
import { ParseJSONString } from '@/lib/parse-json-string'

import { BlogPost } from '../entities/blog-post.entity'

export class BlogPostCreateDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  longTitle?: string

  @Type(() => String)
  @IsString()
  alias: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  content?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readTime?: string

  @Type(() => ParseBooleanString)
  @IsBoolean()
  active: boolean

  @Type(() => ParseJSONString)
  @IsObject()
  @IsOptional()
  seo?: Record<string, string>

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  imageId?: number | null

  @IsArray()
  @IsOptional()
  tags?: Array<string>
}

export class BlogPostUpdateDto extends PartialType(BlogPostCreateDto) {}

export class BlogPostFindAllDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof BlogPost = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC
}

export class BlogPostFindOneDto {}

import { Enum, QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator'

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseArray } from '@/lib/parse-array'
import { ParseObject } from '@/lib/parse-object'

import { BlogPost, BlogPostStatusEnum } from '../entities/blog-post.entity'
import { ParseBoolean } from '@/lib/parse-boolean'

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
  @IsOptional()
  alias?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  content?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  readTime?: string

  @IsEnum(BlogPostStatusEnum)
  @IsOptional()
  status?: BlogPostStatusEnum

  @ParseObject()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, string>

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
  query?: string

  @ParseArray()
  @IsArray()
  @IsOptional()
  tags?: string[]

  @ParseBoolean()
  @IsBoolean()
  withExtraContent: boolean = false

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof BlogPost = 'createdAt'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.DESC
}

export class BlogPostFindOneDto {}

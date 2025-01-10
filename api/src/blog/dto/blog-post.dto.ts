import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseArray } from '@/lib/parse-array'
import { ParseBoolean } from '@/lib/parse-boolean'
import { ParseObject } from '@/lib/parse-object'
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
import { BlogPost, BlogPostStatusEnum } from '../entities/blog-post.entity'

export class BlogPostCreateDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  long_title?: string

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
  read_time?: string

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

  @IsString()
  @IsOptional()
  dir: 'asc' | 'desc' = 'desc'
}

export class BlogPostFindOneDto {}

import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseObject } from '@/lib/parse-object'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsObject, IsOptional, IsString } from 'class-validator'
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
  sort: keyof BlogTag = 'name'

  @IsString()
  @IsOptional()
  dir: 'asc' | 'desc' = 'asc'
}

export class BlogTagFindOneDto {}

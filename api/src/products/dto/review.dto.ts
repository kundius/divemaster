import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { SORT_DIRECTIONS, SortDirection } from '@/shared/types/sort.types'
import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateIf
} from 'class-validator'

export const REVIEW_SORTABLE_FIELDS = ['id', 'createdAt', 'publishedAt', 'rating'] as const
export type ReviewSortableFields = (typeof REVIEW_SORTABLE_FIELDS)[number]

export class CreateReviewDto {
  @Type(() => Boolean)
  @IsBoolean()
  isPublished: boolean

  @Type(() => Boolean)
  @IsBoolean()
  isRecommended: boolean

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @Type(() => Number)
  @IsNumber()
  productId: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  advantages?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  flaws?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  comment?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  author?: string

  // @Type(() => Number)
  @ValidateIf((o) => o.userId !== null)
  @IsNumber()
  @IsOptional()
  userId?: number | null

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  publishedAt?: Date
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

export class FindAllReviewQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  productId?: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  userId?: number

  @Type(() => String)
  @IsString()
  @IsOptional()
  query?: string

  @IsOptional()
  @IsIn(REVIEW_SORTABLE_FIELDS)
  sort: ReviewSortableFields = 'createdAt'

  @IsOptional()
  @IsIn(SORT_DIRECTIONS)
  dir: SortDirection = 'DESC'
}

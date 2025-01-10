import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Brand } from '../entities/brand.entity'

export class CreateBrandDto {
  @Type(() => String)
  @IsString()
  title: string
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class FindAllBrandQueryDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Brand = 'id'

  @IsString()
  @IsOptional()
  dir: 'asc' | 'desc' = 'asc'
}

export class FindOneBrandQueryDto {}

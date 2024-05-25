import { FilterQuery } from '@mikro-orm/core'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { Category } from '../entities/category.entity'

export class GetTreeCategoryQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly parent: number | null = null

  @Transform(({ value }) => value.split(',').map(Number).filter(isFinite))
  @IsArray()
  @IsOptional()
  readonly parents?: number[]

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  readonly depth: number = 3

  @Transform(({ value }) => !['0', 'false'].includes(value))
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean

  get where() {
    const where: FilterQuery<Category> = {
      parent: this.parent
    }
    if (typeof this.parents !== 'undefined') {
      where.id = { $in: this.parents }
    }
    if (typeof this.active !== 'undefined') {
      where.active = this.active
    }
    return where
  }
}

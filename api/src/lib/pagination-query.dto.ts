import { FilterQuery, FindOptions, OrderDefinition, QueryOrder } from '@mikro-orm/core'
import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class PaginationQueryDto<Entity = unknown> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort?: keyof Entity

  @IsEnum(QueryOrder)
  @IsOptional()
  readonly dir?: QueryOrder

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  readonly all: boolean = false

  get take(): number {
    return this.limit
  }

  get skip(): number {
    return (this.page - 1) * this.limit
  }

  get orderBy(): OrderDefinition<Entity> | undefined {
    if (this.sort && this.dir) {
      return { [this.sort]: this.dir } as OrderDefinition<Entity>
    }
    return undefined
  }

  get where(): FilterQuery<Entity> {
    return {}
  }

  get options(): FindOptions<Entity, never, '*', never> {
    const output: FindOptions<Entity, never, '*', never> = {}
    if (!this.all) {
      output.limit = this.take
      output.offset = this.skip
    }
    if (this.orderBy) {
      output.orderBy = this.orderBy
    }
    return output
  }
}

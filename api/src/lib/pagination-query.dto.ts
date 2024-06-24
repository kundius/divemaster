import { FindOptions, OrderDefinition, QueryOrder } from '@mikro-orm/core'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class PaginationQueryDto<Entity = unknown> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit: number = 10

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort: string = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  readonly dir: QueryOrder = QueryOrder.ASC

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  readonly all: boolean = false

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly populate?: never[]

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly filters?: never[]

  get take(): number {
    return this.limit
  }

  get skip(): number {
    return (this.page - 1) * this.limit
  }

  get offset(): number {
    return (this.page - 1) * this.limit
  }

  get orderBy(): OrderDefinition<Entity> | undefined {
    return { [this.sort]: this.dir } as OrderDefinition<Entity>
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
    if (this.populate) {
      output.populate = this.populate
    }
    if (this.filters) {
      output.filters = this.filters
    }
    return output
  }
}

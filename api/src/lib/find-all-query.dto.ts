import { FindOptions, OrderDefinition, QueryOrder } from '@mikro-orm/core'
import { Transform, Type } from 'class-transformer'
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator'

export class FindAllQueryDto<Entity extends object> {
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly populate?: never[]

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly filters?: never[]

  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly sort?: keyof Entity

  @IsEnum(QueryOrder)
  @IsOptional()
  readonly dir?: QueryOrder

  get orderBy(): OrderDefinition<Entity> | undefined {
    if (this.sort && this.dir) {
      return { [this.sort]: this.dir } as OrderDefinition<Entity>
    }
    return undefined
  }

  get options(): FindOptions<Entity, never, '*', never> {
    const output: FindOptions<Entity, never, '*', never> = {}
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

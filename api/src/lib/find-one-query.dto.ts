import { FindOneOptions } from '@mikro-orm/core'
import { Transform } from 'class-transformer'
import { IsArray, IsOptional } from 'class-validator'

export class FindOneQueryDto<Entity extends object> {
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly populate?: never[]

  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsOptional()
  readonly filters?: never[]

  get options(): FindOneOptions<Entity, never, '*', never> {
    const output: FindOneOptions<Entity, never, '*', never> = {}
    if (this.populate) {
      output.populate = this.populate
    }
    if (this.filters) {
      output.filters = this.filters
    }
    return output
  }
}

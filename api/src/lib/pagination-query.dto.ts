import { Type } from 'class-transformer'
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm'

export enum SortDir {
  ASC = 'ASC',
  DESC = 'DESC'
}

export class PaginationQueryDto<Entity = any> {
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

  @IsEnum(SortDir)
  @IsOptional()
  readonly dir?: SortDir

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

  get order() {
    const order: FindOptionsOrder<Entity> = {}
    if (this.sort && this.dir) {
      order[this.sort as string] = this.dir // 'as string' добавлен, потому что 'keyof Entity' почему-то не срабатывает здесь
    }
    return order
  }

  get where(): FindOptionsWhere<Entity> {
    return {}
  }

  get options(): FindManyOptions<Entity> {
    const options: FindManyOptions<Entity> = {
      where: this.where,
      order: this.order
    }
    if (!this.all) {
      options.skip = this.skip
      options.take = this.take
    }
    return options
  }
}

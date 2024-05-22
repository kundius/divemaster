import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
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
    return {
      where: this.where,
      order: this.order,
      take: this.take,
      skip: this.skip
    }
  }
}

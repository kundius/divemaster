import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'
import { Order } from '../entities/order.entity'

export class FindAllOrderQueryDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly query?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Order = 'createdAt'

  @IsString()
  @IsOptional()
  dir: 'ASC' | 'DESC' = 'DESC'
}

export class FindAllForUserDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Order = 'createdAt'

  @IsString()
  @IsOptional()
  dir: 'ASC' | 'DESC' = 'DESC'
}


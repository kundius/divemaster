import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { ParseObject } from '@/lib/parse-object'
import { Order } from '@/order/entities/order.entity'
import { Type } from 'class-transformer'
import { IsObject, IsOptional, IsString } from 'class-validator'

export class SignInDto {
  @Type(() => String)
  @IsString()
  email: string

  @Type(() => String)
  @IsString()
  password: string
}

export class SignUpDto {
  @Type(() => String)
  @IsString()
  name: string

  @Type(() => String)
  @IsString()
  phone: string

  @Type(() => String)
  @IsString()
  email: string

  @Type(() => String)
  @IsString()
  password: string

  @Type(() => String)
  @IsString()
  passwordConfirmation: string
}

export class UpdateProfileDto {
  @Type(() => String)
  @IsString()
  name: string

  @Type(() => String)
  @IsString()
  phone: string

  @Type(() => String)
  @IsString()
  email: string

  @Type(() => String)
  @IsString()
  password: string

  @Type(() => String)
  @IsString()
  passwordConfirmation: string

  @ParseObject()
  @IsObject()
  address: Record<string, string>
}

export class FindProfileOrdersDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof Order = 'createdAt'

  @IsString()
  @IsOptional()
  dir: 'ASC' | 'DESC' = 'DESC'
}

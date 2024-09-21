import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { User } from '../entities/user.entity'
import { QueryOrder } from '@mikro-orm/core'
import { PartialType } from '@nestjs/mapped-types'
import { ParseArray } from '@/lib/parse-array'

export class CreateUserDto {
  @Type(() => String)
  @IsString()
  name: string

  @Type(() => String)
  @IsEmail()
  email: string

  @Type(() => String)
  @IsString()
  password: string

  @Type(() => Number)
  @IsNumber()
  roleId: number

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FindAllUserQueryDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  query?: string

  @ParseArray()
  @IsArray()
  @IsOptional()
  roles?: string[]

  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof User = 'id'

  @IsEnum(QueryOrder)
  @IsOptional()
  dir: QueryOrder = QueryOrder.ASC
}

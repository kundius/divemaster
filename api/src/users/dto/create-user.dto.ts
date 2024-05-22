import { Type } from 'class-transformer'
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator'

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
  role_id: number

  @Type(() => Boolean)
  @IsBoolean()
  active: boolean
}

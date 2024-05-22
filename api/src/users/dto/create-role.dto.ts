import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

export class CreateRoleDto {
  @Type(() => String)
  @IsString()
  title: string

  @Type(() => Array)
  @IsArray()
  @IsOptional()
  scope?: string[]
}

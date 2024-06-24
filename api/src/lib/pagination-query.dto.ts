import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationQueryDto {
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

  get take(): number {
    return this.limit
  }

  get skip(): number {
    return (this.page - 1) * this.limit
  }
}

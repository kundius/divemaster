import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types'
import { PaginationQueryDto } from '@/lib/pagination-query.dto'
import { SyncTask } from '../entities/sync-task.entity'
import { SyncProduct } from '../entities/sync-product.entity'

// export class CreateTaskFromArchiveDto {
//   @Type(() => String)
//   @IsString()
//   title: string
// }

// export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class FindAllSyncTaskDto extends PaginationQueryDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  sort: keyof SyncTask = 'createdAt'

  @IsString()
  @IsOptional()
  dir: 'asc' | 'desc' = 'desc'
}

// export class FindOneBrandQueryDto {}

import { FindOneQueryDto } from '@/lib/find-one-query.dto'
import { Category } from '../entities/category.entity'

export class FindOneCategoryQueryDto extends FindOneQueryDto<Category> {}

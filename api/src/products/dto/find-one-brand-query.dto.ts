import { FindOneQueryDto } from '@/lib/find-one-query.dto'
import { Brand } from '../entities/brand.entity'

export class FindOneBrandQueryDto extends FindOneQueryDto<Brand> {}

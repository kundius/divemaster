import { FindOneQueryDto } from '@/lib/find-one-query.dto'
import { Product } from '../entities/product.entity'

export class FindOneProductQueryDto extends FindOneQueryDto<Product> {}

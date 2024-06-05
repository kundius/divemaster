import { PartialType } from '@nestjs/mapped-types'
import { CreateProductContentDto } from './create-product-content.dto'

export class UpdateProductContentDto extends PartialType(CreateProductContentDto) {}

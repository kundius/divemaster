import { ParseBoolean } from '@/lib/parse-boolean'
import { ParseObject } from '@/lib/parse-object'
import { $Enums } from '@prisma/client'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString
} from 'class-validator'

export class GetOrderCostDto {
  @ParseBoolean()
  @IsBoolean()
  @IsOptional()
  personalDiscount?: boolean

  @IsEnum($Enums.DeliveryService)
  @IsOptional()
  deliveryService?: $Enums.DeliveryService

  @ParseObject()
  @IsObject()
  @IsOptional()
  deliveryProperties?: Record<string, unknown>

  @IsEnum($Enums.PaymentService)
  @IsOptional()
  paymentService?: $Enums.PaymentService
}

export class CreateOrderDto {
  @ParseBoolean()
  @IsBoolean()
  agreement: boolean

  @ParseBoolean()
  @IsBoolean()
  legalEntity: boolean

  @ParseBoolean()
  @IsBoolean()
  personalDiscount: boolean

  @IsEnum($Enums.PaymentService)
  paymentService: $Enums.PaymentService

  @IsEnum($Enums.DeliveryService)
  deliveryService: $Enums.DeliveryService

  @Type(() => String)
  @IsString()
  deliveryAddress: string

  @Type(() => String)
  @IsString()
  recipientEmail: string

  @Type(() => String)
  @IsString()
  recipientName: string

  @Type(() => String)
  @IsString()
  recipientPhone: string
}

export class AddProductDto {
  @Type(() => Number)
  @IsNumber()
  id: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number

  @Type(() => Array)
  @IsArray()
  optionValues?: number[]
}

export class UpdateProductDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity?: number
}

export class TemporaryCreateOrderDto {
  @Type(() => String)
  @IsString()
  @IsOptional()
  customerPhone?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  customerEmail?: string

  @Type(() => String)
  @IsString()
  @IsOptional()
  customerName?: string
}

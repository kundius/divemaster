import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

import { ParseBooleanString } from '@/lib/parse-boolean-string'
import { DeliveryMethod, PaymentMethod } from '@/order/entities/order.entity'

export class GetOrderCostDto {
  @ParseBooleanString()
  @IsBoolean()
  @IsOptional()
  personalDiscount?: boolean

  @IsEnum(DeliveryMethod)
  @IsOptional()
  deliveryMethod?: DeliveryMethod

  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod
}

export class AddProductDto {
  @Type(() => Number)
  @IsNumber()
  id: number

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number

  @Type(() => Array)
  @IsArray()
  optionValues?: number[]
}

export class UpdateProductDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  amount?: number
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

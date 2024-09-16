import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'

import { ParseBooleanString } from '@/lib/parse-boolean-string'
import { DeliveryService } from '@/order/entities/delivery.entity'
import { PaymentServiceEnum } from '@/order/entities/payment.entity'

export class GetOrderCostDto {
  @ParseBooleanString()
  @IsBoolean()
  @IsOptional()
  personalDiscount?: boolean

  @IsEnum(DeliveryService)
  @IsOptional()
  deliveryService?: DeliveryService

  @IsEnum(PaymentServiceEnum)
  @IsOptional()
  paymentService?: PaymentServiceEnum
}

export class CreateOrderDto {
  @ParseBooleanString()
  @IsBoolean()
  agreement: boolean

  @ParseBooleanString()
  @IsBoolean()
  legalEntity: boolean

  @ParseBooleanString()
  @IsBoolean()
  personalDiscount: boolean

  @IsEnum(PaymentServiceEnum)
  paymentService: PaymentServiceEnum

  @IsEnum(DeliveryService)
  deliveryService: DeliveryService

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

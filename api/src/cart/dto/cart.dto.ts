import { ParseBoolean } from '@/lib/parse-boolean'
import { ParseObject } from '@/lib/parse-object'
import { DeliveryService } from '@/order/entities/delivery.entity'
import { PaymentServiceEnum } from '@/order/entities/payment.entity'
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

  @IsEnum(DeliveryService)
  @IsOptional()
  deliveryService?: DeliveryService

  @ParseObject()
  @IsObject()
  @IsOptional()
  deliveryProperties?: Record<string, unknown>

  @IsEnum(PaymentServiceEnum)
  @IsOptional()
  paymentService?: PaymentServiceEnum
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

  @IsEnum(PaymentServiceEnum)
  paymentService: PaymentServiceEnum

  @IsEnum(DeliveryService)
  deliveryService: DeliveryService

  @ParseObject()
  @IsObject()
  deliveryProperties: Record<string, unknown>

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

  @ParseObject()
  @IsObject()
  @IsOptional()
  options?: Record<string, string>
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

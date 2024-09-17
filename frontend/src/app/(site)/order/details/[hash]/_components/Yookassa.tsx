'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { OrderEntity } from '@/types'

import { useOrderDetails } from './OrderDetailsProvider'

export interface YookassaProps {
  order: OrderEntity
}

export function Yookassa({ order }: YookassaProps) {
  return (
    <Button className="w-full uppercase font-sans-narrow" size="lg" asChild>
      <Link href={order.payment.link || '#'} target="_blank">
        Перейти к оплате
      </Link>
    </Button>
  )
}

'use client'

import useSWR from 'swr'

import { useCartStore } from '@/providers/cart-store-provider'
import { useOrderStore } from '@/providers/order-store-provider'
import { CartGetOrderCost } from '@/types'

import { OrderInfo, OrderInfoSkeleton } from '../../cart/_components/OrderInfo'

export function OrderInfoContainer() {
  const cartId = useCartStore((state) => state.cartId)
  const personalDiscount = useOrderStore((state) => state.personalDiscount)
  const payment = useOrderStore((state) => state.payment)
  const delivery = useOrderStore((state) => state.delivery)
  const params: Record<string, any> = { personalDiscount }
  if (payment) {
    params.paymentMethod = payment.method
  }
  if (delivery) {
    params.deliveryMethod = delivery.method
  }
  const { data, isLoading } = useSWR<CartGetOrderCost>(
    cartId ? [`cart/${cartId}/get-order-cost`, params] : null
  )

  if (isLoading || !data) {
    return <OrderInfoSkeleton />
  }

  return <OrderInfo items={data.composition} cost={data.cost} />
}

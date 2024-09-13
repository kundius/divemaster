'use client'

import { useEffect } from 'react'
import useSWR from 'swr'

import { useCartStore } from '@/providers/cart-store-provider'
import { useOrderStore } from '@/providers/order-store-provider'
import { CartGetOrderCost } from '@/types'

import { OrderInfo, OrderInfoSkeleton } from './OrderInfo'

export function OrderInfoContainer() {
  const cartId = useCartStore((state) => state.cartId)
  const cartProducts = useCartStore((state) => state.cartProducts)
  const personalDiscount = useOrderStore((state) => state.personalDiscount)
  const { data, isLoading, mutate } = useSWR<CartGetOrderCost>(
    cartId
      ? [
          `cart/${cartId}/get-order-cost`,
          {
            personalDiscount
          }
        ]
      : null
  )

  useEffect(() => {
    if (isLoading) return

    mutate(data, { revalidate: true })
  }, [cartProducts])

  if (isLoading || !data) {
    return <OrderInfoSkeleton />
  }

  return <OrderInfo items={data.composition} cost={data.cost} />
}

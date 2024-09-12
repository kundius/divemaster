'use client'

import useSWR from 'swr'

import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import { useOrderStore } from '@/providers/order-store-provider'
import { CartGetOrderCost } from '@/types'

import styles from './OrderInfo.module.scss'
import { useEffect } from 'react'
import { useFirstMountState, useMountedState } from '@reactuses/core'

export function OrderInfo() {
  const isFirstMount = useFirstMountState()
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

  if (isLoading) {
    return <div>loading</div>
  }

  if (!data) {
    return
  }

  const { cost, composition } = data

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Ваш заказ</div>
      {composition.length > 0 && (
        <div className={styles.prices}>
          {composition.map((item, i) => (
            <div key={`${i}/${item.name}`} className={styles.price}>
              <div className={styles.priceLabel}>{item.name}</div>
              <div
                className={cn(styles.priceValue, { [styles.priceValueNegative]: item.value < 0 })}
              >
                {formatPrice(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.total}>
        <div className={styles.totalLabel}>Итого</div>
        <div className={styles.totalValue}>{formatPrice(cost)}</div>
      </div>
    </div>
  )
}

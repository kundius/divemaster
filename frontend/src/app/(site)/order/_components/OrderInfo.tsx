'use client'

import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import styles from './OrderInfo.module.scss'
import useSWR from 'swr'
import { CartGetOrderCost, PaymentMethod } from '@/types'
import { useOrderStore } from '@/providers/order-store-provider'

export function OrderInfo() {
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

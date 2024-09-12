'use client'

import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import styles from './OrderInfo.module.scss'

export function OrderInfo() {
  const total = useCartStore((state) => state.total)

  const getOrderPrices = () => {
    const prices: {
      label: string
      value: number
      negative?: boolean
    }[] = []

    prices.push({
      label: `Товары, ${total.count} шт.`,
      value: total.oldPrice
    })

    prices.push({
      label: `Скидки и акции`,
      value: total.discount,
      negative: true
    })

    return prices
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Ваш заказ</div>
      <div className={styles.prices}>
        {getOrderPrices().map((price, i) => (
          <div key={i} className={styles.price}>
            <div className={styles.priceLabel}>{price.label}</div>
            <div className={cn(styles.priceValue, { [styles.priceValueNegative]: price.negative })}>
              {formatPrice(price.value)}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.total}>
        <div className={styles.totalLabel}>Итого</div>
        <div className={styles.totalValue}>{formatPrice(total.price)}</div>
      </div>
    </div>
  )
}

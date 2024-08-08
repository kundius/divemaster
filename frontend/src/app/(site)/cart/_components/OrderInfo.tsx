'use client'

import { cn, formatPrice } from '@/lib/utils'
import styles from './OrderInfo.module.scss'

export interface OrderInfoProps {
  prices: {
    label: string
    value: number
    negative?: boolean
  }[]
  totalCost: number
}

export function OrderInfo({ prices, totalCost: totalPrice }: OrderInfoProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Ваш заказ</div>
      <div className={styles.prices}>
        {prices.map((price, i) => (
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
        <div className={styles.totalValue}>{formatPrice(totalPrice)}</div>
      </div>
    </div>
  )
}

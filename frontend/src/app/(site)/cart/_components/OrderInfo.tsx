import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPrice } from '@/lib/utils'

import styles from './OrderInfo.module.css'

export interface OrderInfoProps {
  items?: {
    name: string
    caption: string
    value: number
  }[]
  cost?: number
}

export function OrderInfo({ cost, items = [] }: OrderInfoProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Ваш заказ</div>
      {items.length > 0 && (
        <div className={styles.prices}>
          {items.map((item, i) => (
            <div key={item.name} className={styles.price}>
              <div className={styles.priceLabel}>{item.caption}</div>
              <div
                className={cn(styles.priceValue, { [styles.priceValueNegative]: item.value < 0 })}
              >
                {formatPrice(item.value)}
              </div>
            </div>
          ))}
        </div>
      )}
      {typeof cost !== 'undefined' && (
        <div className={styles.total}>
          <div className={styles.totalLabel}>Итого</div>
          <div className={styles.totalValue}>{formatPrice(cost)}</div>
        </div>
      )}
    </div>
  )
}

export function OrderInfoSkeleton() {
  return (
    <div className={styles.wrap}>
      <div className={styles.title}>Ваш заказ</div>
      <div className={styles.prices}>
        <div className={styles.price}>
          <div className={styles.priceLabel}>
            <Skeleton className="w-44 h-4" />
          </div>
          <div className={styles.priceValue}>
            <Skeleton className="w-20 h-4" />
          </div>
        </div>
        <div className={styles.price}>
          <div className={styles.priceLabel}>
            <Skeleton className="w-32 h-4" />
          </div>
          <div className={styles.priceValue}>
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        <div className={styles.price}>
          <div className={styles.priceLabel}>
            <Skeleton className="w-24 h-4" />
          </div>
          <div className={styles.priceValue}>
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
      </div>
      <div className={styles.total}>
        <div className={styles.totalLabel}>Итого</div>
        <div className={styles.totalValue}>
          <Skeleton className="w-32 h-4" />
        </div>
      </div>
    </div>
  )
}

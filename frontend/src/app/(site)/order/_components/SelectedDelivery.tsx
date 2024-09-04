import { DeliveryMethod } from '@/types'
import css from './SelectedDelivery.module.scss'
import { cn } from '@/lib/utils'

export interface SelectedDeliveryProps {
  selected?: DeliveryMethod
  items: {
    title: string
    method: DeliveryMethod
  }[]
}

export function SelectedDelivery({ selected, items }: SelectedDeliveryProps) {
  return (
    <div className={css.wrapper}>
      {items.map((item) => (
        <div
          key={item.method}
          className={cn(css.item, {
            [css.item_active]: item.method === selected
          })}
        >
          {item.title}
        </div>
      ))}
    </div>
  )
}

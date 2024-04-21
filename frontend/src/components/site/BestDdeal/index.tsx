import { Card } from './Card'
import styles from './index.module.scss'

export interface BestDdealProps {
  items: {
    images: string[]
    hit: boolean
    new: boolean
    discount: number
    price: number
    oldPrice?: number
    title: string
    brand: string
    colors: string[]
    sizes: string[]
  }[]
}

export function BestDdeal({ items }: BestDdealProps) {
  return (
    <div className={styles.root}>
      <div className={styles.title}>Лучшее предложение</div>
      <div className="grid gap-4 grid-cols-4">
        {items.map((item, i) => (
          <Card {...item} key={i} />
        ))}
      </div>
    </div>
  )
}

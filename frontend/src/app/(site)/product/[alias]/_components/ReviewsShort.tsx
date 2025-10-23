import { cn, declOfNum, formatPrice } from '@/lib/utils'
import styles from './ReviewsShort.module.css'

export interface ReviewsShortProps {
  count: number
  rating: number
}

function displayCount(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0
  }).format(value)
}

export function ReviewsShort({ count, rating }: ReviewsShortProps) {
  return (
    <a href="#reviews" className={styles.wrap}>
      <span className={styles.rating}>
        <span className={styles.ratingFill} style={{ width: `${(rating / 5) * 100}%` }}></span>
      </span>
      <span className={styles.count}>
        {displayCount(count)} {declOfNum(count, ['отзыв', 'отзыва', 'отзывов'])}
      </span>
    </a>
  )
}

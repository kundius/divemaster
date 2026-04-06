import { declOfNum } from '@/lib/utils'
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
    <a
      href="#reviews"
      className={styles.wrap}
      itemProp="aggregateRating"
      itemScope
      itemType="https://schema.org/AggregateRating"
    >
      {' '}
      <meta itemProp="ratingValue" content={rating.toFixed(1)} />
      <span className={styles.rating}>
        <span className={styles.ratingFill} style={{ width: `${(rating / 5) * 100}%` }}></span>
      </span>
      <span className={styles.count}>
        <span itemProp="reviewCount">{displayCount(count)}</span>{' '}
        {declOfNum(count, ['отзыв', 'отзыва', 'отзывов'])}
      </span>
    </a>
  )
}

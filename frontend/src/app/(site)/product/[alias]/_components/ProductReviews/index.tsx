'use client'

import useSWR from 'swr'
import styles from './index.module.css'
import { FindAllResult, ReviewEntity } from '@/types'

export interface ProductReviewsProps {
  productId: number
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data, isLoading, mutate } = useSWR<
    FindAllResult<ReviewEntity> & {
      averageRating: number
      ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number }
      recommendationPercentage: number
    }
  >(
    [
      `reviews`,
      {
        productId,
        sort: 'publishedAt',
        dir: 'DESC'
      }
    ],
    {
      keepPreviousData: true
    }
  )
  console.log(data)
  return (
    <div id="reviews">
      <div className={styles.headline}>
        <span className="icon icon-comments w-6 h-6" />
        Отзывы ({data?.total ?? 0})
      </div>
      {productId}
    </div>
  )
}

import { Skeleton } from '@/components/ui/skeleton'
import styles from './Stats.module.css'
import { declOfNum } from '@/lib/utils'
import { StarIcon } from '@heroicons/react/24/solid'
import { useMemo } from 'react'

export interface StatsProps {
  totalReviews: number
  averageRating: number
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number }
  recommendationPercentage: number
}

export function Stats({
  totalReviews,
  averageRating,
  ratingDistribution,
  recommendationPercentage
}: StatsProps) {
  const averageNumber = useMemo(() => {
    return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(averageRating)
  }, [averageRating])

  const starPercent = useMemo(() => {
    return (averageRating / 5) * 100
  }, [averageRating])

  const total = useMemo(() => {
    return new Intl.NumberFormat('ru-RU', { useGrouping: true }).format(totalReviews)
  }, [totalReviews])

  return (
    <div className={styles.layout}>
      <div className={styles.layoutTop}>
        <div className={styles.layoutLeft}>
          <div className={styles.average}>
            <div className={styles.averageNumber}>{averageNumber}</div>
            <div className={styles.averageStars}>
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <StarIcon className="size-4" />
              <div className={styles.averageStarsFill} style={{ width: `${starPercent}%` }}>
                <StarIcon className="size-4" />
                <StarIcon className="size-4" />
                <StarIcon className="size-4" />
                <StarIcon className="size-4" />
                <StarIcon className="size-4" />
              </div>
            </div>
            <div className={styles.averageTotal}>
              {total} {declOfNum(totalReviews, ['отзыв', 'отзыва', 'отзывов'])}
            </div>
          </div>
        </div>
        <div className={styles.layoutRight}>
          <div className={styles.distribution}>
            {Object.entries(ratingDistribution)
              .reverse()
              .map(([n, v]) => (
                <div className={styles.distributionRow} key={n}>
                  <div className={styles.distributionRowNum}>{n}</div>
                  <div className={styles.distributionRowPart}>
                    <div
                      className={styles.distributionRowPartProgress}
                      style={{ width: `${(v / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <div className={styles.distributionRowTotal}>
                    {new Intl.NumberFormat('ru-RU', { useGrouping: true }).format(v)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={styles.layoutBottom}>
        <div className={styles.recommend}>
          <span className={styles.recommendIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="19px">
              <path
                fillRule="evenodd"
                fill="rgb(255, 255, 255)"
                d="M1.543,7.772 C1.325,8.032 1.279,8.405 1.406,8.726 L1.405,8.727 C1.923,9.217 1.125,9.955 0.603,9.466 C0.603,9.466 -0.302,8.092 0.800,6.979 C0.805,6.973 0.811,6.969 0.818,6.965 L7.491,0.809 C9.558,-1.098 12.672,1.835 10.606,3.742 L9.411,4.844 L12.640,4.861 C14.676,4.871 15.276,6.896 14.456,8.104 C14.407,8.178 14.291,8.315 14.291,8.315 C14.291,8.315 14.701,8.556 15.035,8.753 C15.263,8.888 15.456,9.001 15.456,9.001 C16.149,10.159 15.493,11.638 14.103,11.991 C14.840,13.102 14.287,14.580 12.951,15.018 C13.898,16.371 12.860,18.212 11.086,18.203 L3.199,18.162 C2.325,18.158 1.243,17.314 1.245,16.453 C1.249,15.761 2.376,15.767 2.372,16.458 C2.373,16.595 2.794,17.055 3.177,17.111 C5.726,17.028 8.516,17.138 11.092,17.151 C12.489,17.159 12.543,15.193 11.149,15.130 L10.623,15.126 C9.881,15.122 9.887,14.071 10.628,14.075 L12.214,14.083 C13.524,14.090 13.703,12.301 12.417,12.077 L11.463,12.053 C10.721,12.049 10.727,10.998 11.469,11.002 L13.517,11.012 C14.898,11.019 14.976,9.087 13.601,8.991 L11.276,8.980 C10.535,8.976 10.540,7.925 11.282,7.929 C11.282,7.929 13.346,7.939 12.624,7.935 C14.050,7.943 14.060,5.919 12.635,5.912 C8.982,5.893 10.330,5.903 6.680,5.885 L9.813,2.995 C10.825,2.060 9.297,0.622 8.285,1.556 L1.804,7.534 C1.721,7.611 1.632,7.703 1.543,7.772 L1.543,7.772 Z"
              />
            </svg>
          </span>
          <span className={styles.recommendText}>
            <strong>{recommendationPercentage}%</strong> покупателей рекомендуют этот товар
          </span>
        </div>
      </div>
    </div>
  )
}

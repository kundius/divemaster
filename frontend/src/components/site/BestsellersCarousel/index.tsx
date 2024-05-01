'use client'

import { usePrevNextButtons } from '@/components/lib/EmblaCarousel/usePrevNextButtons'
import { ProductCard } from '@/components/site/ProductCard'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './index.module.scss'

export interface BestsellersCarouselProps {
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

export function BestsellersCarousel({ items }: BestsellersCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false
  })
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)
  return (
    <div className={styles.root}>
      <div className={styles.headline}>
        <div className={styles.title}>БЕСТСЕЛЛЕРЫ</div>
        <div className={styles.nav}>
          <button className={styles.prev} onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <button className={styles.next} onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
      <div className={styles.slider}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {items.map((item, i) => (
              <div className={styles.slide} key={i}>
                <ProductCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

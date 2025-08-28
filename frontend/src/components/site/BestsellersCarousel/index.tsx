'use client'

import { usePrevNextButtons } from '@/lib/EmblaCarousel/usePrevNextButtons'
import { ProductCard } from '@/components/ProductCard'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './index.module.css'
import { ProductEntity } from '@/types'
import { getFileUrl } from '@/lib/utils'
import { ProductStoreProvider } from '@/providers/product-store-provider'

export interface BestsellersCarouselProps {
  items: ProductEntity[]
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
                <ProductStoreProvider product={item}>
                  <ProductCard />
                </ProductStoreProvider>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

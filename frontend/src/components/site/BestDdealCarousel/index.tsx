'use client'

import { usePrevNextButtons } from '@/lib/EmblaCarousel/usePrevNextButtons'
import { ProductCard } from '@/components/site/ProductCard'
import useEmblaCarousel from 'embla-carousel-react'
import styles from './index.module.scss'
import { ProductEntity } from '@/types'
import { getFileUrl } from '@/lib/utils'

export interface BestDdealCarouselProps {
  items: ProductEntity[]
}

export function BestDdealCarousel({ items }: BestDdealCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false
  })
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)
  return (
    <div className={styles.root}>
      <div className={styles.headline}>
        <div className={styles.title}>Лучшее предложение</div>
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
                <ProductCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  href={`/product/${item.alias}`}
                  price={item.price}
                  favorite={item.favorite}
                  recent={item.recent}
                  oldPrice={item.oldPrice || undefined}
                  images={item.images ? item.images.map((item) => getFileUrl(item.file)) : []}
                  brand={
                    item.brand !== null && typeof item.brand === 'object'
                      ? item.brand.title
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

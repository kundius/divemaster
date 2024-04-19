'use client'

import { usePrevNextButtons } from '@/components/lib/EmblaCarousel/usePrevNextButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Container } from '../Container'
import styles from './index.module.scss'
import { Item } from './Item'

export interface BestsellersSectionProps {
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
  }[]
}

export function BestsellersSection({ items }: BestsellersSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    // align: 'end',
  })
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.headline}>
          <div className={styles.title}>БЕСТСЕЛЛЕРЫ</div>
          <div className={styles.nav}>
            <button
              className={styles.prev}
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
            <button
              className={styles.next}
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>
        </div>
        <div className={styles.slider}>
          <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.container}>
              {items.map((item, i) => (
                <div className={styles.slide} key={i}>
                  <Item {...item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

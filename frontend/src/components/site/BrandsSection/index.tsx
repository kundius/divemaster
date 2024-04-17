'use client'

import { usePrevNextButtons } from '@/components/lib/EmblaCarousel/usePrevNextButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Container } from '../Container'
import styles from './index.module.scss'

export interface BrandsSectionProps {
  items: {
    image: string
  }[]
}

export function BrandsSection({ items }: BrandsSectionProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50
  })
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)
  return (
    <div className={styles.root}>
      <Container>
        <div className={styles.hedline}>
          <div className={styles.title}>Бренды</div>
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
          <a href="#" className={styles.all}>
            смотреть все
          </a>
        </div>
        <div className={styles.slider}>
          <div className={styles.viewport} ref={emblaRef}>
            <div className={styles.container}>
              {items.map((item, i) => (
                <div className={styles.slide} key={i}>
                  <img src={item.image} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

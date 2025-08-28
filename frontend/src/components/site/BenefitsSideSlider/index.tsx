'use client'

import { useDotButton } from '@/lib/EmblaCarousel/useDotButton'
import { usePrevNextButtons } from '@/lib/EmblaCarousel/usePrevNextButtons'
import { cn } from '@/lib/utils'
import { EmblaCarouselType, EmblaEventType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import styles from './index.module.css'
import { Discount } from './Discount'

const TWEEN_FACTOR_BASE = 1

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

export interface BenefitsSideSliderProps {
  items: {
    name: string
    content: ReactNode
  }[]
}

export function BenefitsSideSlider(props: BenefitsSideSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50
  })

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  return (
    <div className={styles.root}>
      <div className={styles.overflow}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {props.items.map((item, i) => (
              <div className={styles.slide} key={item.name}>
                {item.content}
              </div>
            ))}
          </div>
          <div className={styles.dots}>
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={cn(styles.dot, {
                  [styles.dotSelected]: index === selectedIndex
                })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const BenefitsSideSliderDiscount = Discount

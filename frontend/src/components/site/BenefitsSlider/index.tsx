'use client'

import { useDotButton } from '@/components/lib/EmblaCarousel/useDotButton'
import { usePrevNextButtons } from '@/components/lib/EmblaCarousel/usePrevNextButtons'
import { cn } from '@/lib/utils'
import { EmblaCarouselType, EmblaEventType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import styles from './index.module.scss'
import { Discount } from './Discount'

const TWEEN_FACTOR_BASE = 1

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

export interface BenefitsSliderProps {
  items: {
    name: string
    content: ReactNode
  }[]
}

export function BenefitsSlider(props: BenefitsSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50
  })
  const tweenFactor = useRef(0)

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenOpacity = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const opacity = numberWithinRange(tweenValue, 0, 1).toString()
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenFactor(emblaApi)
    tweenOpacity(emblaApi)
    emblaApi.on('reInit', setTweenFactor).on('reInit', tweenOpacity).on('scroll', tweenOpacity)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, tweenOpacity])

  return (
    <div className={styles.root}>
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
  )
}

export const BenefitsSliderDiscount = Discount

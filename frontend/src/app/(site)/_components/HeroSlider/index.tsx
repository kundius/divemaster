'use client'

import { cn } from '@/lib/utils'
import styles from './index.module.css'

import { useDotButton } from '@/lib/EmblaCarousel/useDotButton'
import { usePrevNextButtons } from '@/lib/EmblaCarousel/usePrevNextButtons'
import { EmblaCarouselType, EmblaEventType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ReactNode, useCallback, useEffect, useRef } from 'react'
import { CarpHunting } from './CarpHunting'
import { Discount } from './Discount'
import { Expert } from './Expert'
import { NewYear } from './NewYear'
import { Spearfishing } from './Spearfishing'

const TWEEN_FACTOR_BASE = 0.2

export interface HeroSliderProps {
  slides: {
    name: string
    content: ReactNode
  }[]
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50
  })
  const tweenFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('[data-parallax]') as HTMLElement
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenParallax = useCallback((emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
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

        const translate = diffToTarget * (-1 * tweenFactor.current) * 100
        const tweenNode = tweenNodes.current[slideIndex]
        tweenNode.style.transform = `translateX(${translate}%)`
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenParallax(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
  }, [emblaApi, tweenParallax])

  return (
    <section className={styles.root} data-hero-after-header={''}>
      <svg viewBox="0 0 2000 850" width="0" height="0" className={styles['clip-path-root']}>
        <defs>
          <clipPath id="hero-clip-path" className={styles['clip-path-mask']}>
            <path d="M52.97-2.18c8.31 8.22 15.17 15.64 21.31 23.21C81.04 29.36 87.17 38 92.47 46.32c5.3 8.33 9.77 16.35 13.61 25.23 3.85 8.88 7.07 18.63 9.82 29.79 2.76 11.16 5.04 23.75 6.29 35.9 1.25 12.15 1.45 23.87.83 35.59-.62 11.72-2.08 23.43-3.79 34.66-1.72 11.23-3.69 21.96-6.91 36.21s-7.69 32.01-14.66 57.48c-6.96 25.48-16.41 58.66-24.99 87.16-8.57 28.49-16.26 52.3-24.31 79.56-8.06 27.26-16.48 57.98-23.6 86.48-7.12 28.49-12.93 54.77-16.83 75.74-3.9 20.97-5.87 36.64-6.65 51.38-.78 14.74-.37 28.56 1.19 42.74 1.56 14.19 4.26 28.75 7.07 42.25 2.8 13.51 5.71 25.97 9.35 38.49 3.64 12.52 8 25.11 11.07 33.68 2.21 6.17 4.03 10.11 6.05 14.57h2l3.44-.01v.01H55.86l3.44-.01v.01h2l256.61-.23c.03.07.07.15.1.23h2l3.44-.01v.01H337.86l3.44-.01v.01h2l1493.32-1.38c-1.76-4-3.49-7.61-5.48-13.19-3.07-8.57-7.44-21.16-11.07-33.68-3.64-12.52-6.55-24.98-9.35-38.49-2.81-13.5-5.51-28.06-7.07-42.25-1.56-14.18-1.98-28-1.2-42.74.78-14.74 2.76-30.41 6.65-51.38 3.9-20.97 9.72-47.25 16.84-75.74 7.12-28.5 15.54-59.22 23.59-86.48 8.05-27.26 15.74-51.07 24.32-79.56 8.57-28.5 18.03-61.68 24.99-87.16 6.97-25.47 11.43-43.23 14.65-57.48 3.23-14.25 5.2-24.98 6.92-36.21 1.71-11.23 3.16-22.94 3.79-34.66.62-11.72.41-23.44-.83-35.59-1.25-12.15-3.54-24.74-6.29-35.9-2.76-11.16-5.98-20.91-9.82-29.79-3.85-8.88-8.31-16.9-13.61-25.23a276.28 276.28 0 0 0-18.19-25.29c-5.93-7.31-12.6-14.51-20.51-22.39L360.26-2.18H340.41l.01.01-3.45-.01h-2c.05.05.09.1.14.15L78.26-2.18H58.41l.01.01-3.45-.01zM40.5 884.94l-10.06.1-10.59-.07v.01l-2-.01v.03l-3.44-.03v.01l-2-.01H12v.01l-1.81-.01H9.85v.01l-2-.01v.01l-1.29-.01v.01l-1.51-.01h-.64v.01l-2-.01H2v.02l-2-.02v.02l-3.44-.02v.01l-2-.01v.42l2-.02v.02l3.44-.03v.03l2-.02v.02h.41l2-.02v.02h.15l2-.02v.02l1.29-.01v.01l2-.02v.02H10l2-.02v.02h.41l1.65-.02h.35v.02l3.44-.04v.04l2-.02v.02l15.6-.16 5.45.04-.02-.02 2.02.02-.02-.03 3.46.03-.01-.01 2.01.01h.41l-.02-.02 2.02.02h.15l-.02-.02 2.02.02-.01-.01 1.3.01-.02-.02 2.02.02h.15l-.02-.02 2.02.02h.41l-.02-.02 2.02.02-.03-.03 3.47.03-.02-.01 2.02.01-.4-.33-1.98.02-.02-.02-3.4.03-.04-.03-1.97.02-.03-.02H57.94l-1.97.02-.03-.02h-.15l-1.98.02-.02-.02-1.27.01-.02-.01-1.97.02-.03-.02h-.15l-1.98.02-.02-.02h-.41l-1.98.02-.02-.02-3.41.03-.03-.03-1.98.02zm282 0-10.06.1-10.59-.07v.01l-2-.01v.03l-3.44-.03v.01l-2-.01H294v.01l-1.81-.01H291.85v.01l-2-.01v.01l-1.29-.01v.01l-1.51-.01h-.64v.01l-2-.01H284v.02l-2-.02v.02l-3.44-.02v.01l-2-.01v.42l2-.02v.02l3.44-.03v.03l2-.02v.02h.41l2-.02v.02h.15l2-.02v.02l1.29-.01v.01l2-.02v.02h.15l2-.02v.02h.41l1.65-.02h.35v.02l3.44-.04v.04l2-.02v.02l15.6-.16 5.45.04-.02-.02 2.02.02-.02-.03 3.46.03-.01-.01 2.01.01h.41l-.02-.02 2.02.02h.15l-.02-.02 2.02.02-.01-.01 1.3.01-.02-.02 2.02.02h.15l-.02-.02 2.02.02h.41l-.02-.02 2.02.02-.03-.03 3.47.03-.02-.01 2.02.01-.4-.33-1.98.02-.02-.02-3.4.03-.04-.03-1.97.02-.03-.02H339.94l-1.97.02-.03-.02h-.15l-1.98.02-.02-.02-1.27.01-.02-.01-1.97.02-.03-.02h-.15l-1.98.02-.02-.02h-.41l-1.98.02-.02-.02-3.41.03-.03-.03-1.98.02z" />
          </clipPath>
        </defs>
      </svg>
      <div className={styles['left-shadow']} />
      <div className={styles['right-shadow']} />
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {slides.map((item) => (
            <div className={styles.slide} key={item.name}>
              <div className={styles['slide-content']}>{item.content}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.nav}>
        <button className={styles.prev} onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <button className={styles.next} onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>

      <div className={styles['dots']}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={cn(styles['dot'], {
              [styles['dot_active']]: selectedIndex === index
            })}
          />
        ))}
      </div>
    </section>
  )
}

export const HeroSliderCarpHunting = CarpHunting
export const HeroSliderDiscount = Discount
export const HeroSliderExpert = Expert
export const HeroSliderNewYear = NewYear
export const HeroSliderSpearfishing = Spearfishing

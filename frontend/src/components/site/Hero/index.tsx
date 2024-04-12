'use client'

import { cn } from '@/lib/utils'
import styles from './index.module.scss'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EmblaCarouselType, EmblaEventType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

const TWEEN_FACTOR_BASE = 0.2

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  }
}

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 50
  })
  // const selectedSlideIndex = useRef(0)
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

        // if (selectedSlideIndex.current === slideIndex) {
        //   diffToTarget = 0
        // }

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
    // emblaApi
    //   .on('select', (a, b) => {
    //     selectedSlideIndex.current = a.selectedScrollSnap()
    //     // console.log('select', a.selectedScrollSnap(), b)
    //   })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, tweenParallax])

  return (
    <section className={styles.root} data-hero-after-header={''}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          <div className={styles.slide}>
            <div className={cn(styles['card'])} style={{ backgroundImage: 'url(/hero/slide-1.jpg)' }}>
              <div className={styles['parallax']} data-parallax={''}>
                <Image
                  src="/hero/slide-1.jpg"
                  width={1920}
                  height={850}
                  loading="eager"
                  alt=""
                  className={cn(styles['parallax-image'], styles['parallax-image-first'])}
                />
              </div>
            </div>
          </div>
          <div className={styles.slide}>
            <div className={cn(styles['card'])} style={{ backgroundImage: 'url(/hero/slide-2.jpg)' }}>
              <div className={styles['parallax']} data-parallax={''}>
                <Image
                  src="/hero/slide-2.jpg"
                  width={1920}
                  height={850}
                  loading="eager"
                  alt=""
                  className={cn(styles['parallax-image'], styles['parallax-image-second'])}
                />
              </div>
            </div>
          </div>
          <div className={styles.slide}>
            <div className={cn(styles['card'])} style={{ backgroundImage: 'url(/hero/slide-3.jpg)' }}>
              <div className={styles['parallax']} data-parallax={''}>
                <Image
                  src="/hero/slide-3.jpg"
                  width={1920}
                  height={850}
                  loading="eager"
                  alt=""
                  className={cn(styles['parallax-image'], styles['parallax-image-third'])}
                />
              </div>
            </div>
          </div>
          <div className={styles.slide}>
            <div className={cn(styles['card'])} style={{ backgroundImage: 'url(/hero/slide-4.jpg)' }}>
              <div className={styles['parallax']} data-parallax={''}>
                <Image
                  src="/hero/slide-4.jpg"
                  width={1920}
                  height={850}
                  loading="eager"
                  alt=""
                  className={cn(styles['parallax-image'], styles['parallax-image-fourth'])}
                />
              </div>
            </div>
          </div>
          <div className={styles.slide}>
            <div className={cn(styles['card'])} style={{ backgroundImage: 'url(/hero/slide-5.jpg)' }}>
              <div className={styles['parallax']} data-parallax={''}>
                <Image
                  src="/hero/slide-5.jpg"
                  width={1920}
                  height={850}
                  loading="eager"
                  alt=""
                  className={cn(styles['parallax-image'], styles['parallax-image-fifth'])}
                />
              </div>
            </div>
          </div>
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
              [styles['dot_before']]: selectedIndex - 1 === index,
              [styles['dot_active']]: selectedIndex === index,
              [styles['dot_after']]: selectedIndex + 1 === index
            })}
          />
        ))}
      </div>
    </section>
  )
}

'use client'

import { usePrevNextButtons } from '@/lib/EmblaCarousel/usePrevNextButtons'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { useMediaQuery } from 'react-responsive'
import styles from './Gallery.module.css'
import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useDotButton } from '@/lib/EmblaCarousel/useDotButton'

export interface GalleryProps {
  items: string[]
}

export function Gallery({ items }: GalleryProps) {
  // const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel()
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    // slidesToScroll: 3,
    containScroll: 'keepSnaps',
    dragFree: true,
    axis: 'y'
  })
  const { selectedIndex, setSelectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaMainApi)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  const mainPrevNextButtons = usePrevNextButtons(emblaMainApi)

  return (
    <div className={styles.root}>
      <div className={styles.sliders}>
        <div className={styles.thumbsSlider}>
          <button
            className={styles.thumbsPrev}
            onClick={mainPrevNextButtons.onPrevButtonClick}
            disabled={mainPrevNextButtons.prevBtnDisabled}
          >
            <ChevronUpIcon className="w-4 h-4" />
          </button>
          <button
            className={styles.thumbsNext}
            onClick={mainPrevNextButtons.onNextButtonClick}
            disabled={mainPrevNextButtons.nextBtnDisabled}
          >
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          <div className={styles.thumbsViewport} ref={emblaThumbsRef}>
            <div className={styles.thumbsContainer}>
              {items.map((item, index) => (
                <div className={styles.thumbsSlide} key={index}>
                  <div
                    className={cn(styles.thumbsFigure, {
                      [styles.thumbsFigureActive]: index === selectedIndex
                    })}
                  >
                    <Image
                      src={item}
                      alt=""
                      width={100}
                      height={100}
                      onClick={() => onThumbClick(index)}
                      // selected={index === selectedIndex}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.mainSlider}>
          <div className={styles.mainViewport} ref={emblaMainRef}>
            <div className={styles.mainContainer}>
              {items.map((item, index) => (
                <div className={styles.mainSlide} key={index}>
                  <div className={styles.mainFigure}>
                    <Image
                      src={item}
                      alt=""
                      fill
                      sizes="(max-width: 1200px) 50vw, 40vw"
                      // sizes="(max-width: 1200px) 640px, 800px"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.dots}>
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => onDotButtonClick(index)}
            className={cn(styles.dot, {
              [styles.dotActive]: selectedIndex === index,
              [styles.dotPrev]: selectedIndex === index - 1,
              [styles.dotNext]: selectedIndex === index + 1
            })}
          />
        ))}
      </div>
    </div>
  )
}

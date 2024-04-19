import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaCarouselType } from 'embla-carousel'
import styles from './Gallery.module.scss'
import { usePrevNextButtons } from '@/components/lib/EmblaCarousel/usePrevNextButtons'
import { RefObject, useEffect } from 'react'

export interface GalleryProps {
  items: string[]
  startIndex: number
  onChangeIndex: (value: number) => void
  prevRef?: RefObject<HTMLButtonElement>
  nextRef?: RefObject<HTMLButtonElement>
}

export function Gallery({ items, startIndex, onChangeIndex, prevRef, nextRef }: GalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex
  })

  const { onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', (emblaApi: EmblaCarouselType) => {
      onChangeIndex(emblaApi.selectedScrollSnap())
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi])

  useEffect(() => {
    const prevButton = prevRef?.current
    const nextButton = nextRef?.current

    if (prevButton) {
      prevButton.addEventListener('click', onPrevButtonClick)
    }
    if (nextButton) {
      nextButton.addEventListener('click', onNextButtonClick)
    }

    return () => {
      if (prevButton) {
        prevButton.removeEventListener('click', onPrevButtonClick)
      }
      if (nextButton) {
        nextButton.removeEventListener('click', onNextButtonClick)
      }
    }
  }, [prevRef, nextRef, onPrevButtonClick, onNextButtonClick])

  return (
    <div className={styles.slider}>
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {items.map((item, i) => (
            <div className={styles.slide} key={i}>
              <Image src={item} alt="" fill className={styles.image} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

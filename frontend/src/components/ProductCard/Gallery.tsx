import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaCarouselType } from 'embla-carousel'
import styles from './Gallery.module.css'
import { usePrevNextButtons } from '@/lib/EmblaCarousel/usePrevNextButtons'
import { RefObject, useEffect } from 'react'
import { cn } from '@/lib/utils'

export interface GalleryProps {
  items: string[]
  startIndex: number
  showNav: boolean
  onChangeIndex: (value: number) => void
}

export function Gallery({ items, startIndex, onChangeIndex, showNav }: GalleryProps) {
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
  }, [emblaApi])

  return (
    <div
      className={cn(styles.root, {
        [styles.showNav]: showNav
      })}
    >
      <div className={styles.slider}>
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {items.map((item, i) => (
              <div className={styles.slide} key={i}>
                <Image
                  src={item}
                  alt=""
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.prev}>
        <button className={styles.prevButton} onClick={onPrevButtonClick} />
      </div>
      <div className={styles.next}>
        <button className={styles.nextButton} onClick={onNextButtonClick} />
      </div>
    </div>
  )
}

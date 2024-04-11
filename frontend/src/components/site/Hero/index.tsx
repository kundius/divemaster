'use client'

import { cn } from '@/lib/utils'
import styles from './index.module.scss'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { useEffect, useState } from 'react'

export function Hero() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Carousel
      setApi={setApi}
      className={cn(styles.root, 'w-full')}
      data-hero-after-header={''}
      opts={{
        loop: true
      }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className={styles.slide}>
              <span className="text-4xl font-semibold">{index + 1}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className={styles['page-list']}>
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            className={cn(styles['page-item'], {
              [styles['page-item_before']]: current - 1 === index,
              [styles['page-item_active']]: current === index,
              [styles['page-item_after']]: current + 1 === index
            })}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>

      <div className={styles.nav}>
        <button
          className={styles.prev}
          disabled={!api?.canScrollPrev}
          onClick={() => api?.scrollPrev()}
        />
        <button
          className={styles.next}
          disabled={!api?.canScrollNext}
          onClick={() => api?.scrollNext()}
        />
      </div>
    </Carousel>
  )
}

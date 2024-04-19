'use client'

import { cn, displayPrice } from '@/lib/utils'
import styles from './Item.module.scss'
import Image from 'next/image'
import { Gallery } from './Gallery'
import { useRef, useState } from 'react'

export interface ItemProps {
  images: string[]
  hit: boolean
  new: boolean
  discount: number
  price: number
  oldPrice?: number
  title: string
  brand: string
  colors: string[]
}

export function Item(props: ItemProps) {
  const [showGallery, setShowGallery] = useState(false)
  const [thumbIndex, setThumbIndex] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  const handleMouseEnter = () => {
    setShowGallery(true)
  }

  const handleMouseLeave = () => {
    setShowGallery(false)
    setStartIndex(thumbIndex)
  }

  return (
    <div className={styles.card} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={styles.meta}>
        <div className={styles.hit}>Хит</div>
        <div className={styles.new}>New!</div>
        <div className={styles.discount}>-{props.discount}%</div>
      </div>
      <div className={styles.actions}>
        <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
        <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
      </div>
      <div className={styles.colors}>
        {props.colors.map((color) => (
          <div className={styles.color} key={color} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className={styles.media}>
        <div className={styles.mediaContainer}>
          <div className={styles.mediaThumb}>
            <Image
              src={props.images[thumbIndex]}
              alt={props.title}
              fill
              className={styles.thumbImage}
            />
            {showGallery && (
              <div className={styles.mediaGallery}>
                <Gallery
                  items={props.images}
                  startIndex={startIndex}
                  onChangeIndex={setThumbIndex}
                  prevRef={prevRef}
                  nextRef={nextRef}
                />
              </div>
            )}
          </div>
          <div className={styles.mediaPrev}>
            <button className={styles.mediaPrevButton} ref={prevRef} />
          </div>
          <div className={styles.mediaNext}>
            <button className={styles.mediaNextButton} ref={nextRef} />
          </div>
        </div>
      </div>
      <a href="#" className={styles.title}>
        {props.title}
      </a>
      <div className={styles.brand}>{props.brand}</div>
      <div className={styles.prices}>
        {props.oldPrice && <div className={styles.oldPrice}>{displayPrice(props.oldPrice)}</div>}
        <div className={styles.realPrice}>{displayPrice(props.price)}</div>
      </div>
      <div className={styles.cart}>
        <button className={styles.cartAdd}>В корзину</button>
      </div>
    </div>
  )
}

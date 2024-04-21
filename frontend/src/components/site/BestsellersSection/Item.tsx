'use client'

import { cn, displayPrice } from '@/lib/utils'
import styles from './Item.module.scss'
import Image from 'next/image'
import { Gallery } from './Gallery'
import { useRef, useState } from 'react'
import { Thumb } from './Thumb'

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
  const [galleryShowNav, setGalleryShowNav] = useState(false)
  const [thumbIndex, setThumbIndex] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const showGalleryTimer = useRef<ReturnType<typeof setTimeout>>()

  const handleMouseEnter = () => {
    if (showGalleryTimer.current) {
      clearTimeout(showGalleryTimer.current)
    }

    setShowGallery(true)
    setGalleryShowNav(true)
  }

  const handleMouseLeave = () => {
    setGalleryShowNav(false)

    if (showGalleryTimer.current) {
      clearTimeout(showGalleryTimer.current)
    }

    showGalleryTimer.current = setTimeout(() => {
      setShowGallery(false)
      setStartIndex(thumbIndex)
    }, 1200)
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
          {showGallery ? (
            <Gallery
              items={props.images}
              startIndex={startIndex}
              onChangeIndex={setThumbIndex}
              showNav={galleryShowNav}
            />
          ) : (
            <Thumb url={props.images[thumbIndex]} alt={props.title} />
          )}
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
      <div className={styles.purchaseActions}>
        <button className={cn(styles.purchaseAction, styles.purchaseActionCart)}>В корзину</button>
      </div>
    </div>
  )
}

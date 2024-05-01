import { cn, displayPrice } from '@/lib/utils'
import { useRef, useState } from 'react'
import { Gallery } from './Gallery'
import { Thumb } from './Thumb'
import styles from './index.module.scss'
import Image from 'next/image'

export interface ProductCardProps {
  images: string[]
  hit: boolean
  new: boolean
  discount: number
  price: number
  oldPrice?: number
  title: string
  brand: string
  colors: string[]
  sizes: string[]
}

export function ProductCard(props: ProductCardProps) {
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
    <div className={styles.root} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={styles.meta}>
        <div className={styles.hit}>Хит</div>
        <div className={styles.new}>New!</div>
      </div>
      <div className={styles.discount}>-{props.discount}%</div>
      <div className={styles.media}>
        <div className={styles.mediaContainer}>
          <div className={styles.mediaThumb}>
            <Image
              src={props.images[thumbIndex]}
              alt={props.title}
              fill
              className={styles.mediaThumbImage}
            />
          </div>
          <div className={styles.mediaGallery}>
            {showGallery && (
              <Gallery
                items={props.images}
                startIndex={startIndex}
                onChangeIndex={setThumbIndex}
                showNav={galleryShowNav}
              />
            )}
          </div>
        </div>
      </div>
      <div className={styles.prices}>
        <div className={styles.realPrice}>{displayPrice(props.price)}</div>
        {props.oldPrice && <div className={styles.oldPrice}>{displayPrice(props.oldPrice)}</div>}
      </div>
      <a href="#" className={styles.title}>
        {props.title}
      </a>
      <div className={styles.brand}>{props.brand}</div>
      <div className={styles.sizes}>
        {props.sizes.map((item, i) => (
          <div className={styles.size} key={i}>
            <label className={styles.sizeLabel}>
              <input className={styles.sizeRadio} type="radio" name="size" value={item} />
              <span className={styles.sizeTitle}>{item}</span>
            </label>
          </div>
        ))}
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
      <div className={styles.purchaseActions}>
        <button className={cn(styles.purchaseAction, styles.purchaseActionCart)}>
          <span className={styles.purchaseActionInner}>
            <span className="text-nowrap">В корзину</span>
          </span>
        </button>
        <button className={cn(styles.purchaseAction, styles.purchaseActionOneClick)}>
          <span className={styles.purchaseActionInner}>
            Купить <span className="text-nowrap">в 1 клик</span>
          </span>
        </button>
      </div>
    </div>
  )
}

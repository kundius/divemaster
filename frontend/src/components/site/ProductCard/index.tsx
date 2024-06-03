import { cn, displayPrice } from '@/lib/utils'
import { useRef, useState } from 'react'
import { Gallery } from './Gallery'
import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export interface ProductCardProps {
  id: number
  title: string
  href: string
  price: number
  images: string[]

  favorite?: boolean
  recent?: boolean
  oldPrice?: number
  brand?: string
  colors?: string[]
  sizes?: string[]
}

export function ProductCard({
  id,
  title,
  href,
  favorite = false,
  recent = false,
  images,
  price,
  oldPrice,
  colors,
  sizes,
  brand
}: ProductCardProps) {
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

  const getDiscount = () => {
    if (!oldPrice) return 0
    return Math.round((oldPrice - price) / price * 100)
  }

  if (images.length === 0) {
    images.push('/noimage.png')
  }

  return (
    <div className={styles.root} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={styles.meta}>
        {favorite && <div className={styles.hit}>Хит</div>}
        {recent && <div className={styles.new}>New!</div>}
        {oldPrice && <div className={styles.discount}>-{getDiscount()}%</div>}
      </div>
      <div className={styles.media}>
        <div className={styles.mediaContainer}>
          <div className={styles.mediaThumb}>
            <Image src={images[thumbIndex]} alt={title} fill className={styles.mediaThumbImage} />
          </div>
          {images.length > 1 && (
            <div className={styles.mediaGallery}>
              {showGallery && (
                <Gallery
                  items={images}
                  startIndex={startIndex}
                  onChangeIndex={setThumbIndex}
                  showNav={galleryShowNav}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.prices}>
        <div className={styles.realPrice}>{displayPrice(price)}</div>
        {oldPrice && <div className={styles.oldPrice}>{displayPrice(oldPrice)}</div>}
      </div>
      <Link href={href} className={styles.title}>
        {title}
      </Link>
      {brand && <div className={styles.brand}>{brand}</div>}
      {sizes && (
        <div className={styles.sizes}>
          {sizes.map((item, i) => (
            <div className={styles.size} key={i}>
              <label className={styles.sizeLabel}>
                <input className={styles.sizeRadio} type="radio" name="size" value={item} />
                <span className={styles.sizeTitle}>{item}</span>
              </label>
            </div>
          ))}
        </div>
      )}
      <div className={styles.actions}>
        <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
        <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
      </div>
      {colors && (
        <div className={styles.colors}>
          {colors.map((color) => (
            <div className={styles.color} key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
      )}
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

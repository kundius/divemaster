'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

import { colorsObject } from '@/lib/colors'
import { getFileUrl, pluck } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'

import { AddToCart } from './AddToCart'
import { BuyInClick } from './BuyInClick'
import { Gallery } from './Gallery'
import styles from './index.module.scss'
import { PropertyType } from '@/types'

export function ProductCard() {
  const productStore = useProductStore((state) => state)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryShowNav, setGalleryShowNav] = useState(false)
  const [thumbIndex, setThumbIndex] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const showGalleryTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const images = useMemo(() => {
    if (!productStore.product.images || productStore.product.images.length === 0) {
      return ['/noimage.png']
    }
    return productStore.product.images.map((item) => getFileUrl(item.fileId))
  }, [productStore.product])

  const colors = useMemo(() => {
    return (productStore.product.options || [])
      .filter(({ name }) => name == 'color')
      .map(({ content }) => content)
  }, [productStore.selectable])

  const brand = productStore.product.brand ? productStore.product.brand.title : undefined
  const price = productStore.displayPrice(productStore.offer)
  const oldPrice = productStore.displayOldPrice(productStore.offer)

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
        {productStore.product.favorite && <div className={styles.hit}>Хит</div>}
        {productStore.product.recent && <div className={styles.new}>New!</div>}
        {productStore.product.priceDecrease && (
          <div className={styles.discount}>-{productStore.product.priceDecrease}%</div>
        )}
      </div>
      <div className={styles.media}>
        <div className={styles.mediaContainer}>
          <div className={styles.mediaThumb}>
            <Image
              src={images[thumbIndex]}
              alt={productStore.product.title}
              fill
              className={styles.mediaThumbImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
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
        <div className={styles.realPrice}>{price}</div>
        {oldPrice && <div className={styles.oldPrice}>{oldPrice}</div>}
      </div>
      <Link href={`/product/${productStore.product.alias}`} className={styles.title}>
        {productStore.product.title}
      </Link>
      {brand && <div className={styles.brand}>{brand}</div>}
      {/* TODO: ИЗБРАННОЕ */}
      {/* TODO: СРАВНЕНИЕ */}
      {/* <div className={styles.actions}>
        <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
        <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
      </div> */}
      {colors && (
        <div className={styles.colors}>
          {colors.map((color) => (
            <div
              className={styles.color}
              key={color}
              style={{ backgroundColor: colorsObject[color] }}
            />
          ))}
        </div>
      )}
      <div className={styles.purchaseActions}>
        <AddToCart />
        <BuyInClick />
      </div>
    </div>
  )
}

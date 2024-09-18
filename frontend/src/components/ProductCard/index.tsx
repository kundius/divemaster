'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

import { colorsObject } from '@/lib/colors'
import { getEntityId, getFileUrl, pluck } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'

import { AddToCart } from './AddToCart'
import { BuyInClick } from './BuyInClick'
import { Gallery } from './Gallery'
import styles from './index.module.scss'

export function ProductCard() {
  const product = useProductStore((state) => state.product)
  const defaultPrice = useProductStore((state) => state.defaultPrice)
  const defaultOldPrice = useProductStore((state) => state.defaultOldPrice)
  const [showGallery, setShowGallery] = useState(false)
  const [galleryShowNav, setGalleryShowNav] = useState(false)
  const [thumbIndex, setThumbIndex] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const showGalleryTimer = useRef<ReturnType<typeof setTimeout>>()

  const images = useMemo(() => {
    if (!product.images || product.images.length === 0) {
      return ['/noimage.png']
    }
    return product.images.map((item) => getFileUrl(item.file))
  }, [product])

  const colors = useMemo(() => {
    if (!product.options || product.options.length === 0) {
      return []
    }

    const option = product.options.find((option) => option.key === 'color')
    if (!option) {
      return []
    }

    option.values = (product.optionValues || []).filter(
      (ov) => getEntityId(ov.option) === option.id
    )
    if (option.values.length < 2) {
      return []
    }

    return pluck(option.values, 'content')
  }, [product])

  const brand =
    product.brand !== null && typeof product.brand === 'object' ? product.brand.title : undefined

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
        {product.favorite && <div className={styles.hit}>Хит</div>}
        {product.recent && <div className={styles.new}>New!</div>}
        {product.priceDecrease && <div className={styles.discount}>-{product.priceDecrease}%</div>}
      </div>
      <div className={styles.media}>
        <div className={styles.mediaContainer}>
          <div className={styles.mediaThumb}>
            <Image
              src={images[thumbIndex]}
              alt={product.title}
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
        <div className={styles.realPrice}>{defaultPrice}</div>
        {defaultOldPrice && <div className={styles.oldPrice}>{defaultOldPrice}</div>}
      </div>
      <Link href={`/product/${product.alias}`} className={styles.title}>
        {product.title}
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

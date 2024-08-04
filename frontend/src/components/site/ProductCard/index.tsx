import { cn, getFileUrl } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { Gallery } from './Gallery'
import styles from './index.module.scss'

export function ProductCard() {
  const { product, displayOldPrice, displayPrice, selectedOffer } = useProductStore(
    (state) => state
  )
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

  const title = selectedOffer?.title ? selectedOffer.title : product.title
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
        <div className={styles.realPrice}>{displayPrice}</div>
        {displayOldPrice && <div className={styles.oldPrice}>{displayOldPrice}</div>}
      </div>
      <Link href={`/product/${product.alias}`} className={styles.title}>
        {title}
      </Link>
      {brand && <div className={styles.brand}>{brand}</div>}
      {/* {sizes && (
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
      )} */}
      <div className={styles.actions}>
        <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
        <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
      </div>
      {/* {colors && (
        <div className={styles.colors}>
          {colors.map((color) => (
            <div className={styles.color} key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
      )} */}
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

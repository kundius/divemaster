import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { colorsObject } from '@/lib/colors'
import { cn, getEntityId, getFileUrl, pluck } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import { useProductStore } from '@/providers/product-store-provider'

import { Gallery } from './Gallery'
import styles from './index.module.scss'
import { SelectOption } from './SelectOption'
import { TooltipPortal } from '@radix-ui/react-tooltip'

export function ProductCard() {
  const {
    product,
    selectOptionValue,
    selectedOffer,
    selectedPrice,
    defaultPrice,
    selectedOldPrice,
    defaultOldPrice,
    additionalOffers,
    basicOffer,
    selectableOptions,
    selectedOptionValues,
    allOptionsSelected
  } = useProductStore((state) => state)
  const addToCart = useCartStore((state) => state.addToCart)

  const [showOptionsDialog, setShowOptionsDialog] = useState(false)
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

  const addHandler = () => {
    addToCart({
      id: product.id,
      optionValues: Object.values(selectedOptionValues).map((item) => item.id)
    })
    toast.success('Товар добавлен в корзину')
    setShowOptionsDialog(false)
  }

  const renderAddToCart = () => {
    if (additionalOffers.length === 0 && !basicOffer) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={cn(styles.purchaseAction)}>
                <span className={styles.purchaseActionInner}>
                  <span className="text-nowrap">Заказать</span>
                </span>
              </button>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>
                <p className="text-center">
                  Сейчас нет в наличии,
                  <br /> доставим под заказ от 1 дня
                </p>
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      )
    }

    if (additionalOffers.length === 0 && !!basicOffer && selectableOptions.length === 0) {
      return (
        <button
          className={cn(styles.purchaseAction, styles.purchaseActionCart)}
          onClick={addHandler}
        >
          <span className={styles.purchaseActionInner}>
            <span className="text-nowrap">В корзину</span>
          </span>
        </button>
      )
    }

    return (
      <Dialog open={showOptionsDialog} onOpenChange={setShowOptionsDialog}>
        <DialogTrigger className={cn(styles.purchaseAction, styles.purchaseActionCart)}>
          <span className={styles.purchaseActionInner}>
            <span className="text-nowrap">В корзину</span>
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[540px] p-8 gap-6">
          <DialogHeader>
            <DialogTitle className="uppercase text-xl tracking-widest">
              Выберите параметры
            </DialogTitle>
          </DialogHeader>
          {selectableOptions.length > 0 && (
            <div className="space-y-6">
              {selectableOptions.map((option) => (
                <SelectOption
                  key={option.id}
                  caption={option.caption}
                  values={option.values}
                  onSelect={(value) => selectOptionValue(option, value)}
                  selected={selectedOptionValues[option.key]}
                />
              ))}
            </div>
          )}
          <div className="bg-neutral-50 flex gap-4 items-center p-4 rounded-xl">
            <div className="flex w-20 h-20 relative shrink-0 bg-white rounded-lg">
              <Image
                src={images[thumbIndex]}
                alt={product.title}
                fill
                className="rounded-lg object-contain"
              />
            </div>
            <div>
              <div className="text-base font-bold leading-5">
                {selectedOffer?.title ? selectedOffer.title : product.title}
              </div>
              <div className="text-primary text-lg font-bold mt-2">{selectedPrice}</div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button className="w-full" size="lg" variant="secondary">
                Отмена
              </Button>
            </DialogClose>
            {allOptionsSelected && !selectedOffer ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full leading-none" size="lg">
                      Заказать
                    </Button>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent>
                      <p className="text-center">
                        Сейчас нет в наличии,
                        <br /> доставим под заказ от 1 дня
                      </p>
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={addHandler}
                disabled={!allOptionsSelected}
                key="available"
              >
                <svg viewBox="0 0 19 17" width="19" height="17" className="fill-current mr-2">
                  <use href="/sprite.svg#cart"></use>
                </svg>
                В корзину
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
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
      <div className={styles.actions}>
        <button type="button" className={cn(styles.action, styles['action-favorite'])}></button>
        <button type="button" className={cn(styles.action, styles['action-compare'])}></button>
      </div>
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
        {renderAddToCart()}
        <button className={cn(styles.purchaseAction, styles.purchaseActionOneClick)}>
          <span className={styles.purchaseActionInner}>
            Купить <span className="text-nowrap">в 1 клик</span>
          </span>
        </button>
      </div>
    </div>
  )
}

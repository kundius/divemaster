'use client'

import Link from 'next/link'

import { useCartStore } from '@/providers/cart-store-provider'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { colors } from '@/lib/colors'
import { formatPrice, getFileUrl } from '@/lib/utils'
import { CartProductEntity, OptionType } from '@/types'
import { useToggle } from '@reactuses/core'
import Image from 'next/image'
import { ChangeEvent, useMemo } from 'react'
import styles from './Product.module.scss'

export interface ProductProps {
  cartProduct: CartProductEntity
}

export function Product({ cartProduct }: ProductProps) {
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const changeQuantity = useCartStore((state) => state.changeQuantity)

  const [showDeleteDialog, toggleDeleteDialog] = useToggle(false)

  const images = useMemo(() => {
    if (!cartProduct.product.images || cartProduct.product.images.length === 0) {
      return ['/noimage.png']
    }
    return cartProduct.product.images.map((item) => getFileUrl(item.file))
  }, [cartProduct.product])

  const quantityMinusHandler = () => {
    const value = cartProduct.quantity - 1
    if (value <= 0) {
      toggleDeleteDialog(true)
    } else {
      changeQuantity(cartProduct, value)
    }
  }

  const quantityPlusHandler = () => {
    const value = cartProduct.quantity + 1
    changeQuantity(cartProduct, value)
  }

  const quantityChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value <= 0) {
      toggleDeleteDialog(true)
    } else {
      changeQuantity(cartProduct, value)
    }
  }

  const renderColor = (value: string) => {
    const color = colors.find((color) => color.name === value)
    if (color) {
      return <span className={styles.optionColor} style={{ backgroundColor: color.color }}></span>
    }
    return null
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.layout}>
        <div className={styles.layoutImage}>
          <div className={styles.figure}>
            <Image
              src={images[0]}
              width={120}
              height={120}
              alt={cartProduct.product.title}
              className={styles.image}
            />
          </div>
        </div>
        <div className={styles.layoutInfo}>
          <div className={styles.info}>
            {cartProduct.product.priceDecrease && (
              <div className={styles.discount}>-{cartProduct.product.priceDecrease}% SALE</div>
            )}
            <Link href={`/product/${cartProduct.product.alias}`} className={styles.title}>
              {cartProduct.product.title}
            </Link>
            {cartProduct.product.sku && (
              <div className={styles.sku}>Артикул: {cartProduct.product.sku}</div>
            )}
          </div>
        </div>
        <div className={styles.layoutActions}>
          <div className={styles.actions}>
            {/* TODO: ИЗБРАННОЕ */}
            {/* <button className={styles.action}>
              <svg viewBox="0 0 19 17" width="19" height="17">
                <use href="/sprite.svg#favorites"></use>
              </svg>
            </button> */}
            <AlertDialog open={showDeleteDialog} onOpenChange={toggleDeleteDialog}>
              <AlertDialogTrigger asChild>
                <button className={styles.action}>
                  <svg viewBox="0 0 17 23" width="17" height="23">
                    <use href="/sprite.svg#trash"></use>
                  </svg>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить товар</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы точно хотите удалить товар?
                    <br />
                    Отменить данное действие будет невозможно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={() => removeFromCart(cartProduct)}>
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className={styles.layoutQuantity}>
          <div className={styles.quantity}>
            <button className={styles.quantityMinus} onClick={quantityMinusHandler}></button>
            <input
              type="number"
              className={styles.quantityInput}
              value={cartProduct.quantity}
              onChange={quantityChangeHandler}
            />
            <button className={styles.quantityPlus} onClick={quantityPlusHandler}></button>
          </div>
        </div>
        <div className={styles.layoutPrice}>
          <div className={styles.prices}>
            {cartProduct.price && (
              <div className={styles.price}>{formatPrice(cartProduct.price)}</div>
            )}
            {cartProduct.oldPrice && (
              <div className={styles.oldPrice}>{formatPrice(cartProduct.oldPrice)}</div>
            )}
            {cartProduct.oldPrice && cartProduct.price && (
              <div className={styles.profit}>
                Выгода {formatPrice(cartProduct.oldPrice - cartProduct.price)}
              </div>
            )}
          </div>
        </div>
        {cartProduct.optionValues && cartProduct.optionValues.length > 0 && (
          <div className={styles.layouOptions}>
            <div className={styles.options}>
              {cartProduct.optionValues?.map((optionValue) => (
                <div key={optionValue.id} className={styles.option}>
                  {typeof optionValue.option !== 'number' && (
                    <div className={styles.optionLabel}>{optionValue.option.caption}:</div>
                  )}
                  {typeof optionValue.option !== 'number' &&
                    optionValue.option.type === OptionType.COMBOCOLORS &&
                    renderColor(optionValue.content)}
                  <div className={styles.optionValue}>{optionValue.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

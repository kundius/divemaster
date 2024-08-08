// 'use client'

// import Link from 'next/link'

// import { PrimaryButton } from '@/components/site/PrimaryButton'
// import { useCartStore } from '@/providers/cart-store-provider'
// import { useAuthStore } from '@/providers/auth-store-provider'
// import { Button } from '@/components/ui/button'

// import styles from './Product.module.scss'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger
// } from '@/components/ui/alert-dialog'
// import { OrderInfo, OrderInfoProps } from './OrderInfo'
// import { Switch } from '@/components/ui/switch'
// import Image from 'next/image'
// import { formatPrice } from '@/lib/utils'
// import { ChangeEvent, useState } from 'react'
// import { useToggle } from '@reactuses/core'

// export interface ProductProps {
//   image: string
//   title: string
//   price: number
//   oldPrice?: number
//   amount: number
//   sku?: string | null
//   discount?: string
//   options?: {
//     label?: string
//     value: string
//   }[]
//   onChangeAmount: (amount: number) => void
//   onDelete: () => void
// }

// export function Product({
//   image,
//   title,
//   discount,
//   sku,
//   price,
//   oldPrice,
//   amount,
//   options = [],
//   onChangeAmount,
//   onDelete
// }: ProductProps) {
//   const [showDeleteDialog, toggleDeleteDialog] = useToggle(false)

//   const amountMinusHandler = () => {
//     const value = amount - 1
//     if (value <= 0) {
//       toggleDeleteDialog(true)
//     } else {
//       onChangeAmount(value)
//     }
//   }

//   const amountPlusHandler = () => {
//     const value = amount + 1
//     onChangeAmount(value)
//   }

//   const amountChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     const value = Number(e.target.value)
//     if (value <= 0) {
//       toggleDeleteDialog(true)
//     } else {
//       onChangeAmount(value)
//     }
//   }

//   return (
//     <div className={styles.wrap}>
//       <div className={styles.layout}>
//         <div className={styles.layoutImage}>
//           <Image src={image} width={120} height={120} alt={title} />
//         </div>
//         <div className={styles.layoutInfo}>
//           {discount && <div className={styles.discount}>{discount}</div>}
//           <div className={styles.title}>{title}</div>
//           {sku && <div className={styles.article}>{sku}</div>}
//         </div>
//         <div className={styles.layoutActions}>
//           <div className={styles.actions}>
//             <button className={styles.action}>
//               <svg viewBox="0 0 19 17" width="19" height="17">
//                 <use href="/sprite.svg#office-favourites"></use>
//               </svg>
//             </button>
//             <AlertDialog open={showDeleteDialog} onOpenChange={toggleDeleteDialog}>
//               <AlertDialogTrigger asChild>
//                 <button className={styles.action}>
//                   <svg viewBox="0 0 17 23" width="17" height="23">
//                     <use href="/sprite.svg#trash"></use>
//                   </svg>
//                 </button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Удалить товар</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     Вы точно хотите удалить товар?
//                     <br />
//                     Отменить данное действие будет невозможно.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Отмена</AlertDialogCancel>
//                   <AlertDialogAction onClick={onDelete}>Удалить</AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           </div>
//         </div>
//         <div className={styles.layoutAmount}>
//           <div className={styles.amount}>
//             <button className={styles.amountMinus} onClick={amountMinusHandler}></button>
//             <input
//               type="number"
//               className={styles.amountInput}
//               value={amount}
//               onChange={amountChangeHandler}
//             />
//             <button className={styles.amountPlus} onClick={amountPlusHandler}></button>
//           </div>
//         </div>
//         <div className={styles.layoutPrice}>
//           <div className={styles.price}>{formatPrice(price)}</div>
//           {oldPrice && <div className={styles.oldPrice}>{formatPrice(oldPrice)}</div>}
//           {oldPrice && <div className={styles.profit}>Выгода {formatPrice(oldPrice - price)}</div>}
//         </div>
//         <div className={styles.layouOptions}>
//           <div className={styles.options}>
//             {options.map((option) => (
//               <div className={styles.option}>
//                 {option.label && <div className={styles.optionLabel}>{option.label}</div>}
//                 <div className={styles.optionValue}>{option.value}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import Link from 'next/link'

import { PrimaryButton } from '@/components/site/PrimaryButton'
import { useCartStore } from '@/providers/cart-store-provider'
import { useAuthStore } from '@/providers/auth-store-provider'
import { Button } from '@/components/ui/button'

import styles from './Product.module.scss'
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
import { OrderInfo, OrderInfoProps } from './OrderInfo'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { formatPrice, getFileUrl } from '@/lib/utils'
import { ChangeEvent, useMemo, useState } from 'react'
import { useToggle } from '@reactuses/core'
import { CartProductEntity, OptionType } from '@/types'
import { colors } from '@/lib/colors'

export interface ProductProps {
  cartProduct: CartProductEntity
}

export function Product({ cartProduct }: ProductProps) {
  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const changeAmount = useCartStore((state) => state.changeAmount)

  const [showDeleteDialog, toggleDeleteDialog] = useToggle(false)

  const images = useMemo(() => {
    if (!cartProduct.product.images || cartProduct.product.images.length === 0) {
      return ['/noimage.png']
    }
    return cartProduct.product.images.map((item) => getFileUrl(item.file))
  }, [cartProduct.product])

  const amountMinusHandler = () => {
    const value = cartProduct.amount - 1
    if (value <= 0) {
      toggleDeleteDialog(true)
    } else {
      changeAmount(cartProduct, value)
    }
  }

  const amountPlusHandler = () => {
    const value = cartProduct.amount + 1
    changeAmount(cartProduct, value)
  }

  const amountChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value <= 0) {
      toggleDeleteDialog(true)
    } else {
      changeAmount(cartProduct, value)
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
            <button className={styles.action}>
              <svg viewBox="0 0 19 17" width="19" height="17">
                <use href="/sprite.svg#favorites"></use>
              </svg>
            </button>
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
        <div className={styles.layoutAmount}>
          <div className={styles.amount}>
            <button className={styles.amountMinus} onClick={amountMinusHandler}></button>
            <input
              type="number"
              className={styles.amountInput}
              value={cartProduct.amount}
              onChange={amountChangeHandler}
            />
            <button className={styles.amountPlus} onClick={amountPlusHandler}></button>
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
      </div>
    </div>
  )
}

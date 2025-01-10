'use client'

import { useIntersectionObserver } from '@reactuses/core'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { ProductBuyDialog } from '@/components/ProductBuyDialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/providers/cart-store-provider'
import { useProductStore } from '@/providers/product-store-provider'
import { OptionType } from '@/types'

import styles from './AddToCart.module.scss'
import { SelectOption } from './SelectOption'
import { SpriteIcon } from '@/components/SpriteIcon'
import { AddToCartDialog } from '@/components/AddToCartDialog'
import Link from 'next/link'

export const OptionComponents = {
  [OptionType.COMBOCOLORS]: SelectOption,
  [OptionType.COMBOOPTIONS]: SelectOption,
  [OptionType.COMBOBOOLEAN]: undefined,
  [OptionType.NUMBERFIELD]: undefined,
  [OptionType.TEXTFIELD]: undefined
}

export function AddToCart() {
  const addToCart = useCartStore((state) => state.addToCart)
  const productStore = useProductStore((state) => state)

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [showFloatMenu, setShowFloatMenu] = useState(false)
  useIntersectionObserver(wrapperRef, ([e]) => {
    setShowFloatMenu(e.boundingClientRect.bottom < 0)
  })

  const addHandler = () => {
    addToCart({
      id: productStore.product.id,
      optionValues: Object.values(productStore.selectedOptionValues).map((item) => item.id)
    })
    toast.success('Товар добавлен в корзину')
  }
  console.log(productStore)

  return (
    <div ref={wrapperRef}>
      <div className={styles.prices}>
        {productStore.product.priceDecrease && (
          <div className={styles.discount}>-{productStore.product.priceDecrease}%</div>
        )}
        {productStore.selectedOldPrice && (
          <div className={styles.oldPrice}>{productStore.selectedOldPrice}</div>
        )}
        <div className={styles.realPrice}>{productStore.selectedPrice}</div>
      </div>

      {productStore.selectableOptions.length > 0 && (
        <div className={cn(styles.options, 'mt-12')}>
          {productStore.selectableOptions.map((option) => {
            if (!option.values || option.values.length === 0) return null

            const Component = OptionComponents[option.type]

            if (!Component) return null

            return (
              <Component
                key={option.id}
                caption={option.caption}
                type={option.type}
                values={option.values}
                onSelect={(value) => productStore.selectOptionValue(option, value)}
                selected={productStore.selectedOptionValues[option.key]}
              />
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-2 mt-12 max-md:gap-4">
        {productStore.allOptionsSelected && !productStore.selectedOffer ? (
          <ProductBuyDialog title="Заказать от 1 дня">
            <Button className="flex-grow px-4" size="lg" key="not-available">
              <SpriteIcon name="one-click" size={22} className="mr-2 -ml-2" />
              Заказать
            </Button>
          </ProductBuyDialog>
        ) : (
          <Button
            className="flex-grow px-4"
            size="lg"
            onClick={addHandler}
            disabled={!productStore.allOptionsSelected}
            key="available"
          >
            <SpriteIcon name="cart" size={20} className="mr-2 -ml-2" />В корзину
          </Button>
        )}
        <ProductBuyDialog title="Заказать в 1 клик">
          <Button
            variant="accent-outline"
            size="lg"
            className="flex-grow px-4 max-w-40 max-lg:text-sm"
          >
            <span className="w-min whitespace-normal leading-none">
              Купить <span className="text-nowrap">в 1 клик</span>
            </span>
            <SpriteIcon name="one-click" size={22} className="ml-2 -mr-2" />
          </Button>
        </ProductBuyDialog>
      </div>

      <div
        className={cn('flex gap-4 pt-2 px-4 pb-1', styles.floatMenu, {
          [styles.floatMenuVisible]: showFloatMenu
        })}
        data-float-menu={showFloatMenu}
      >
        <div className="flex flex-col flex-grow">
          <AddToCartDialog
            requestButton={
              <Button className="flex-grow h-9 text-sm" size="lg">
                <SpriteIcon name="one-click" size={22} className="mr-2 -ml-2" />
                Заказать
              </Button>
            }
          >
            <Button className="flex-grow h-9 text-sm" size="lg">
              <SpriteIcon name="cart" size={20} className="mr-2 -ml-2" />В корзину
            </Button>
          </AddToCartDialog>
          <div className="text-xs text-center mt-0.5">В наличии на складе</div>
        </div>
        <div className="flex flex-col flex-grow">
          <ProductBuyDialog title="Заказать в 1 клик">
            <Button variant="accent-outline" size="lg" className="flex-grow px-4 h-9 text-sm">
              <span className="w-min whitespace-normal leading-none">
                Купить <span className="text-nowrap">в 1 клик</span>
              </span>
              <SpriteIcon name="one-click" size={22} className="ml-2 -mr-2" />
            </Button>
          </ProductBuyDialog>
          <div className="text-xs text-primary underline text-center mt-0.5">
            <Link href="/info/delivery-and-payment" target="_blank">
              Доставка
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

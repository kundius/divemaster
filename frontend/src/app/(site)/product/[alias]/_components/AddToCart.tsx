'use client'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCartStore } from '@/providers/cart-store-provider'
import { useProductStore } from '@/providers/product-store-provider'
import { OptionType } from '@/types'

import styles from './AddToCart.module.scss'
import { SelectOption } from './SelectOption'
import { TooltipPortal } from '@radix-ui/react-tooltip'

export const OptionComponents = {
  [OptionType.COMBOCOLORS]: SelectOption,
  [OptionType.COMBOOPTIONS]: SelectOption,
  [OptionType.COMBOBOOLEAN]: undefined,
  [OptionType.NUMBERFIELD]: undefined,
  [OptionType.TEXTFIELD]: undefined
}

export function AddToCart() {
  const addToCart = useCartStore((state) => state.addToCart)
  const {
    product,
    selectOptionValue,
    selectedOffer,
    selectedOldPrice,
    selectedPrice,
    selectableOptions,
    selectedOptionValues,
    allOptionsSelected
  } = useProductStore((state) => state)

  const addHandler = () => {
    addToCart({
      id: product.id,
      optionValues: Object.values(selectedOptionValues).map((item) => item.id)
    })
    toast.success('Товар добавлен в корзину')
  }

  return (
    <div className="space-y-12">
      <div>
        {product.priceDecrease && <div className={styles.discount}>-{product.priceDecrease}%</div>}
        {selectedOldPrice && <div className={styles.oldPrice}>{selectedOldPrice}</div>}
        <div className={styles.realPrice}>{selectedPrice}</div>
      </div>
      {selectableOptions.length > 0 && (
        <div className={styles.options}>
          {selectableOptions.map((option) => {
            if (!option.values || option.values.length === 0) return null

            const Component = OptionComponents[option.type]

            if (!Component) return null

            return (
              <Component
                key={option.id}
                caption={option.caption}
                type={option.type}
                values={option.values}
                onSelect={(value) => selectOptionValue(option, value)}
                selected={selectedOptionValues[option.key]}
              />
            )
          })}
        </div>
      )}
      <div className="flex items-center gap-2">
        {allOptionsSelected && !selectedOffer ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full leading-none" size="lg" key="not-available">
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
        <Button variant="accent-outline" size="lg" className="max-w-40">
          <span className="w-min whitespace-normal leading-none">
            Купить <span className="text-nowrap">в 1 клик</span>
          </span>
          <svg viewBox="0 0 18 22" width="18" height="22" className="fill-current ml-2">
            <use href="/sprite.svg#one-click"></use>
          </svg>
        </Button>
      </div>
    </div>
  )
}

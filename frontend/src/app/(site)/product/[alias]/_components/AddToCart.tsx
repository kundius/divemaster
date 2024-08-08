'use client'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useProductStore } from '@/providers/product-store-provider'
import { OptionType } from '@/types'
import styles from './AddToCart.module.scss'
import { SelectColor } from './SelectColor'
import { SelectOption } from './SelectOption'
import { useCartStore } from '@/providers/cart-store-provider'
import { Button } from '@/components/ui/button'

const OptionComponents = {
  [OptionType.COMBOCOLORS]: SelectColor,
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
    displayOldPrice,
    displayPrice,
    selectableOptions,
    selectedOptionValues
  } = useProductStore((state) => state)

  const addHandler = () => {
    if (!selectedOffer) {
      toast.warning('Выберите опции товара')
      return
    }
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
        {displayOldPrice && <div className={styles.oldPrice}>{displayOldPrice}</div>}
        <div className={styles.realPrice}>{displayPrice}</div>
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
                values={option.values}
                onSelect={(value) => selectOptionValue(option, value)}
                selected={selectedOptionValues[option.key]}
              />
            )
          })}
        </div>
      )}
      <div className={styles.actions}>
        <button className={cn(styles.action, styles.actionCart)} onClick={addHandler}>
          <svg viewBox="0 0 19 17" width="19" height="17">
            <use href="/sprite.svg#cart"></use>
          </svg>
          <span className={styles.actionInner}>
            <span className="text-nowrap">В корзину</span>
          </span>
        </button>
        <button className={cn(styles.action, styles.actionOneClick)}>
          <span className={styles.actionInner}>
            Купить <span className="text-nowrap">в 1 клик</span>
          </span>
          <svg viewBox="0 0 18 22" width="18" height="22">
            <use href="/sprite.svg#one-click"></use>
          </svg>
        </button>
      </div>
    </div>
  )
}

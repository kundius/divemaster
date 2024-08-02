'use client'

import { cn, displayPrice, pluck, productPrice } from '@/lib/utils'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { OfferEntity, OptionEntity, OptionType, OptionValueEntity, ProductEntity } from '@/types'
import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import styles from './AddToCart.module.scss'
import { SelectColor } from './SelectColor'
import { SelectOption } from './SelectOption'
import { useMountedState } from '@reactuses/core'

export interface AddToCartProps {
  product: ProductEntity
}

const OptionComponents = {
  [OptionType.COMBOCOLORS]: SelectColor,
  [OptionType.COMBOOPTIONS]: SelectOption,
  [OptionType.COMBOBOOLEAN]: undefined,
  [OptionType.NUMBERFIELD]: undefined,
  [OptionType.TEXTFIELD]: undefined
}

export function AddToCart({ product }: AddToCartProps) {
  const [formatPrice, rawPrice] = productPrice(product)

  const [selectedValues, setSelectedValues] = useState<Record<string, OptionValueEntity>>({})

  const createSelectValueHandler = (option: OptionEntity) => (value: OptionValueEntity) => {
    setSelectedValues((prev) => ({ ...prev, [option.key]: value }))
  }

  const addHandler = () => {
    console.log(product, selectedValues)
  }

  const options = useMemo(() => {
    return product.options?.filter((o) => !!OptionComponents[o.type]) || []
  }, [product])

  const sortedOffers = useMemo(() => {
    return (
      product.offers
        ?.sort((a, b) => {
          if (!a.optionValues || !b.optionValues) return 0
          if (a.optionValues.length < b.optionValues.length) return -1
          if (a.optionValues.length > b.optionValues.length) return 1
          return 0
        })
        .reverse() || []
    )
  }, [product])

  const selectedOffer = useMemo(() => {
    return sortedOffers.find((offer) => {
      if (!offer.optionValues) return false
      if (offer.optionValues.length === 0 && Object.values(selectedValues).length === 0) return true
      return pluck(offer.optionValues, 'id').every((id) =>
        pluck(Object.values(selectedValues), 'id').includes(id)
      )
    })
  }, [selectedValues])

  const oldPrice = selectedOffer?.price || rawPrice

  return (
    <div className="space-y-12">
      <div>
        {product.priceDecrease && <div className={styles.discount}>-{product.priceDecrease}%</div>}
        {product.priceDecrease && oldPrice && (
          <div className={styles.oldPrice}>
            {displayPrice(oldPrice + oldPrice * (product.priceDecrease / 100))}
          </div>
        )}
        <div className={styles.realPrice}>
          {selectedOffer ? displayPrice(selectedOffer.price) : formatPrice}
        </div>
      </div>
      {options && options.length > 0 && (
        <div className={styles.options}>
          {options.map((option) => {
            if (!option.values || option.values.length === 0) return null

            const Component = OptionComponents[option.type]

            if (!Component) return null

            return (
              <Component
                key={option.id}
                caption={option.caption}
                values={option.values}
                onSelect={createSelectValueHandler(option)}
                selected={selectedValues[option.key]}
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

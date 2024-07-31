'use client'

import { cn, displayPrice, productPrice } from '@/lib/utils'
import styles from './AddToCart.module.scss'
import { OptionEntity, OptionType, ProductEntity } from '@/types'
import { useElementSize } from '@reactuses/core'
import { useLayoutEffect, useRef, useState } from 'react'
import { OptionsVariant } from './OptionsVariant'
import { OptionsColor } from './OptionsColor'

export interface AddToCartProps {
  // options?: OptionEntity[]
  // productId: number
  // oldPrice: number | null
  product: ProductEntity
}

export function AddToCart({ product }: AddToCartProps) {
  console.log(product)
  const [formatPrice, rawPrice] = productPrice(product)

  const [params, setParams] = useState<Record<string, string>>({})

  const addHandler = () => {
    console.log(product, params)
  }

  return (
    <div className="space-y-12">
      <div>
        {product.priceDecrease && <div className={styles.discount}>-{product.priceDecrease}%</div>}
        {product.priceDecrease && rawPrice && (
          <div className={styles.oldPrice}>
            {displayPrice(rawPrice + rawPrice * (product.priceDecrease / 100))}
          </div>
        )}
        <div className={styles.realPrice}>{formatPrice}</div>
      </div>
      {/* {options && options.length > 0 && (
        <div className={styles.options}>
          {options.map((option) => {
            if (!option.inCart || typeof option.value === 'undefined') return null

            if (option.type === OptionType.COLOR) {
              return (
                <OptionsColor
                  key={option.id}
                  caption={option.caption}
                  items={option.value as string[]}
                  onSelect={(value: string) => setParams({ ...params, [option.key]: value })}
                  selected={params[option.key]}
                />
              )
            }

            if (option.type === OptionType.SIZE) {
              return (
                <OptionsVariant
                  key={option.id}
                  caption={option.caption}
                  items={option.value as string[]}
                  onSelect={(value: string) => setParams({ ...params, [option.key]: value })}
                  selected={params[option.key]}
                />
              )
            }

            if (option.type === OptionType.VARIANT) {
              return (
                <OptionsVariant
                  key={option.id}
                  caption={option.caption}
                  items={option.value as string[]}
                  onSelect={(value: string) => setParams({ ...params, [option.key]: value })}
                  selected={params[option.key]}
                />
              )
            }

            return null
          })}
        </div>
      )} */}
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

'use client'

import { cn } from '@/lib/utils'
import styles from './CartActions.module.scss'
import { OptionEntity } from '@/types'

export interface CartActionsProps {
  options?: OptionEntity[]
  productId: number
}

export function CartActions({ options, productId }: CartActionsProps) {
  console.log(options)
  return (
    <div className={styles.wrap}>
      <button className={cn(styles.action, styles.actionCart)}>
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
  )
}

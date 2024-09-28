import { SpriteIcon } from '@/components/SpriteIcon'

import { AddToCartDialog } from '../AddToCartDialog'
import styles from './AddToCart.module.scss'

export function AddToCart() {
  return (
    <AddToCartDialog
      requestButton={
        <button className={styles['action']}>
          <SpriteIcon name="one-click" size={22} className="mr-2 -ml-1" />
          <span className="text-nowrap">Заказать</span>
        </button>
      }
    >
      <button className={styles['action']}>
        <SpriteIcon name="cart" size={20} className="mr-2 -ml-1" />В корзину
      </button>
    </AddToCartDialog>
  )
}

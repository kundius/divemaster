import { SpriteIcon } from '@/components/SpriteIcon'

import { AddToCartDialog } from '../AddToCartDialog'
import styles from './AddToCart.module.scss'

export function AddToCart() {
  return (
    <AddToCartDialog
      requestButton={
        <button className={styles['action']}>
          <SpriteIcon
            name="one-click"
            className="w-6 h-6 mr-2 -ml-1 max-md:w-3 max-md:h-3 max-md:mr-0.5 max-md:-ml-0.5"
          />
          <span className="text-nowrap">Заказать</span>
        </button>
      }
    >
      <button className={styles['action']}>
        <SpriteIcon
          name="cart"
          className="w-6 h-6 mr-2 -ml-1 max-md:w-3 max-md:h-3 max-md:mr-0.5 max-md:-ml-0.5"
        />
        <span className="text-nowrap">В корзину</span>
      </button>
    </AddToCartDialog>
  )
}

import { SpriteIcon } from '@/components/SpriteIcon'

import { AddToCartDialog } from '../AddToCartDialog'
import styles from './AddToCart.module.css'

export function AddToCart() {
  return (
    <AddToCartDialog
      requestButton={
        <button className={styles['action']}>
          <SpriteIcon
            name="one-click"
            className="w-6 h-6 mr-2 -ml-1 max-3xl:w-5 max-3xl:h-5 max-3xl:mr-1 max-3xl:-ml-1 max-xl:w-4 max-xl:h-4 max-md:w-3 max-md:h-3 max-md:mr-0.5 max-md:-ml-0.5"
          />
          <span className="text-nowrap">Заказать</span>
        </button>
      }
    >
      <button className={styles['action']}>
        <SpriteIcon
          name="cart"
          className="w-6 h-6 mr-2 -ml-1 max-3xl:w-5 max-3xl:h-5 max-3xl:mr-1 max-3xl:-ml-1 max-xl:w-4 max-xl:h-4 max-md:w-3 max-md:h-3 max-md:mr-0.5 max-md:-ml-0.5"
        />
        <span className="text-nowrap">В корзину</span>
      </button>
    </AddToCartDialog>
  )
}

import { ProductBuyDialog } from '@/components/ProductBuyDialog'
import { SpriteIcon } from '@/components/SpriteIcon'

import css from './BuyInClick.module.scss'

export function BuyInClick() {
  return (
    <ProductBuyDialog title="Заказать в 1 клик">
      <button className={css['action']}>
        <span className={css['inner']}>
          Купить <span className="text-nowrap">в 1 клик</span>
        </span>
        <SpriteIcon name="one-click" size={20} className="ml-2 -mr-1" />
      </button>
    </ProductBuyDialog>
  )
}

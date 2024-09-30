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
        <SpriteIcon
          name="one-click"
          className="w-6 h-6 ml-2 -mr-1 max-3xl:w-5 max-3xl:h-5 max-3xl:ml-1 max-3xl:-mr-1 max-xl:w-4 max-xl:h-4 max-md:w-3 max-md:h-3 max-md:ml-0.5 max-md:-mr-0.5"
        />
      </button>
    </ProductBuyDialog>
  )
}

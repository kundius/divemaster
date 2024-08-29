import { ProductBuyDialog } from '@/components/ProductBuyDialog'

import css from './BuyInClick.module.scss'

export function BuyInClick() {
  return (
    <ProductBuyDialog title="Заказать в 1 клик">
      <button className={css['action']}>
        <span className={css['inner']}>
          Купить <span className="text-nowrap">в 1 клик</span>
        </span>
      </button>
    </ProductBuyDialog>
  )
}

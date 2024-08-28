import { BuyInClickDialog } from '@/components/BuyInClickDialog'

import css from './BuyInClick.module.scss'

export function BuyInClick() {
  return (
    <BuyInClickDialog>
      <button className={css['action']}>
        <span className={css['inner']}>
          Купить <span className="text-nowrap">в 1 клик</span>
        </span>
      </button>
    </BuyInClickDialog>
  )
}

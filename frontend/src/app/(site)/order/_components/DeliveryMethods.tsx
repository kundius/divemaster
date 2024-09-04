import { DeliveryMethod } from '@/types'
import { SpriteIcon } from '@/components/SpriteIcon'
import { useOrderStore } from '@/providers/order-store-provider'

import css from './DeliveryMethods.module.scss'
import Link from 'next/link'

export function DeliveryMethods() {
  return (
    <div className={css.wrapper}>
      <Link href="/order/delivery/pickup" className={css.item}>
        <span className={css.icon}>
          <SpriteIcon name="self-pickup" size={40} />
        </span>
        <span className={css.body}>
          <span className={css.title}>Самовывоз</span>
          <span className={css.description}>Из магазина, пункта выдачи или постамата</span>
        </span>
      </Link>
      <Link href="/order/delivery/shipping" className={css.item}>
        <span className={css.icon}>
          <SpriteIcon name="delivery" size={40} />
        </span>
        <span className={css.body}>
          <span className={css.title}>Доставка</span>
          <span className={css.description}>Курьером до вашей двери</span>
        </span>
      </Link>
    </div>
  )
}

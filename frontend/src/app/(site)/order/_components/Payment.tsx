'use client'

import { MethodCard } from '@/components/MethodCard'
import { SpriteIcon } from '@/components/SpriteIcon'
import { useOrderStore } from '@/providers/order-store-provider'
import { PaymentMethod } from '@/types'

import { Errors } from './Errors'
import css from './Payment.module.scss'

export function Payment() {
  const orderState = useOrderStore((state) => state)

  if (!orderState.delivery) {
    return (
      <div>
        <div className={css.title}>Способ оплаты</div>
        <div className={css.description}>
          Выберите способ получения и вы сможете выбрать способ оплаты
        </div>
        <div className="empty:hidden mt-6">
          <Errors field="payment" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className={css.title}>Способ оплаты</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <MethodCard
          title="Онлайн на сайте"
          description="Быстро и удобно"
          icon={<SpriteIcon name="payment-card" size={40} />}
          action={() => orderState.setPayment({ method: PaymentMethod.ONLINE })}
          active={orderState.payment?.method === PaymentMethod.ONLINE}
        />
        <MethodCard
          title="При получении"
          description="Наличными или картой"
          icon={<SpriteIcon name="payment-wallet" size={40} />}
          action={() => orderState.setPayment({ method: PaymentMethod.OFFLINE })}
          active={orderState.payment?.method === PaymentMethod.OFFLINE}
        />
      </div>
      <div className="empty:hidden mt-6">
        <Errors field="payment" />
      </div>
    </div>
  )
}

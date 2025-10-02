'use client'

import { MethodCard } from '@/components/MethodCard'
import { SpriteIcon } from '@/components/SpriteIcon'
import { useOrderStore } from '@/providers/order-store-provider'
import { PaymentService } from '@/types'

import { Errors } from './Errors'
import css from './Payment.module.css'

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
      <div className="mt-4 grid lg:grid-cols-2 gap-3">
        <div className="hidden">
          <MethodCard
            title="Онлайн на сайте"
            description="Быстро и удобно"
            icon={<SpriteIcon name="payment-card" size={40} />}
            action={() => orderState.setPayment({ service: PaymentService.Vtb })}
            active={orderState.payment?.service === PaymentService.Vtb}
          />
        </div>
        <MethodCard
          title="При получении"
          description="Наличными или картой"
          icon={<SpriteIcon name="payment-wallet" size={40} />}
          action={() => orderState.setPayment({ service: PaymentService.UponCash })}
          active={orderState.payment?.service === PaymentService.UponCash}
        />
      </div>
      <div className="empty:hidden mt-6">
        <Errors field="payment" />
      </div>
    </div>
  )
}

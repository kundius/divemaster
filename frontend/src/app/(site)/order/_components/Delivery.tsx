'use client'

import { SpriteIcon } from '@/components/SpriteIcon'
import css from './Delivery.module.scss'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Products } from './Products'
import { useState } from 'react'
import { DeliveryMethod } from '@/types'
import { useOrderStore } from '@/providers/order-store-provider'
import { cn } from '@/lib/utils'
import { SelectedAddress } from './SelectedAddress'
import { SelectedDelivery } from './SelectedDelivery'

const SelectedAddressTitle = {
  [DeliveryMethod.SHIPPING]: 'Доставим курьером',
  [DeliveryMethod.PICKUP]: 'Забрать в магазине'
}

export function Delivery() {
  const changeDeliveryMethod = useOrderStore((state) => state.changeDeliveryMethod)
  const deliveryMethod = useOrderStore((state) => state.deliveryMethod)

  if (!deliveryMethod) {
    return (
      <div>
        <div className={cn(css.title, 'mb-4')}>Выберите способ получения</div>
        <div className={css.warning}>
          <SpriteIcon name="exclamation-circle" size={14} />
          Пожалуйста, обратите внимание. В связи с большим объёмом заказов срок доставки может быть
          увеличен.
        </div>
        <div className={css.methods}>
          <button
            className={css.method}
            onClick={() => changeDeliveryMethod(DeliveryMethod.PICKUP)}
          >
            <span className={css.methodIcon}>
              <SpriteIcon name="self-pickup" size={40} />
            </span>
            <span className={css.methodBody}>
              <span className={css.methodTitle}>Самовывоз</span>
              <span className={css.methodDescription}>
                Из магазина, пункта выдачи или постамата
              </span>
            </span>
          </button>
          <button
            className={css.method}
            onClick={() => changeDeliveryMethod(DeliveryMethod.SHIPPING)}
          >
            <span className={css.methodIcon}>
              <SpriteIcon name="delivery" size={40} />
            </span>
            <span className={css.methodBody}>
              <span className={css.methodTitle}>Доставка</span>
              <span className={css.methodDescription}>Курьером до вашей двери</span>
            </span>
          </button>
        </div>
        <Products className="mt-6" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className={css.title}>Способ получения</div>
        <button className={css.change} onClick={() => changeDeliveryMethod(undefined)}>
          Изменить
        </button>
      </div>
      <SelectedDelivery
        selected={deliveryMethod}
        items={[
          { title: 'Самовывоз', method: DeliveryMethod.PICKUP },
          { title: 'Доставка', method: DeliveryMethod.SHIPPING }
        ]}
      />
      <div className="mt-4">
        <SelectedAddress
          title={SelectedAddressTitle[deliveryMethod]}
          description="Введённый адрес"
        />
      </div>
      <Products className="mt-6" />
    </div>
  )
}

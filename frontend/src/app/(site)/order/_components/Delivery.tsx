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
import { DeliveryMethods } from './DeliveryMethods'
import { TabMarker } from '@/components/TabMarker'

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
        <DeliveryMethods />
        <div className="mt-6">
          <Products />
        </div>
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
      <TabMarker
        items={[
          { title: 'Самовывоз', name: DeliveryMethod.PICKUP },
          { title: 'Доставка', name: DeliveryMethod.SHIPPING }
        ]}
        selected={deliveryMethod}
      />
      <div className="mt-4">
        <SelectedAddress
          title={SelectedAddressTitle[deliveryMethod]}
          description="Введённый адрес"
        />
      </div>
      <div className="mt-6">
        <Products />
      </div>
    </div>
  )
}

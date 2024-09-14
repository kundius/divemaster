'use client'

import { MethodCard } from '@/components/MethodCard'
import { SpriteIcon } from '@/components/SpriteIcon'
import { TabMarker } from '@/components/TabMarker'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { useOrderStore } from '@/providers/order-store-provider'
import { DeliveryService } from '@/types'

import css from './Delivery.module.scss'
import { Errors } from './Errors'
import { Products } from './Products'
import { SelectedAddress } from './SelectedAddress'

const SelectedAddressTitle = {
  [DeliveryService.Shipping]: 'Доставим курьером',
  [DeliveryService.Pickup]: 'Забрать самостоятельно'
}

export function Delivery() {
  const orderState = useOrderStore((state) => state)

  if (!orderState.delivery) {
    return (
      <div>
        <div className={cn(css.title, 'mb-4')}>Выберите способ получения</div>
        <Alert variant="default">
          <SpriteIcon name="exclamation-circle" size={14} />
          <AlertDescription>
            Пожалуйста, обратите внимание. В связи с большим объёмом заказов срок доставки может
            быть увеличен.
          </AlertDescription>
        </Alert>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div>
            <MethodCard
              title="Самовывоз"
              description="Из магазина или пункта выдачи"
              icon={<SpriteIcon name="self-pickup" size={40} />}
              action="/order/delivery/pickup"
            />
          </div>
          <div>
            <MethodCard
              title="Доставка"
              description="Курьером до вашей двери"
              icon={<SpriteIcon name="delivery" size={40} />}
              action="/order/delivery/shipping"
            />
          </div>
        </div>
        <div className="mt-6">
          <Products />
        </div>
        <div className="empty:hidden mt-6">
          <Errors field="delivery" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className={css.title}>Способ получения</div>
        <button className={css.change} onClick={() => orderState.setDelivery(undefined)}>
          Изменить
        </button>
      </div>
      <div className="flex py-0.5">
        <TabMarker
          items={[
            { title: 'Самовывоз', name: DeliveryService.Pickup },
            { title: 'Доставка', name: DeliveryService.Shipping }
          ]}
          selected={orderState.delivery.method}
        />
      </div>
      <div className="mt-4">
        <SelectedAddress
          title={SelectedAddressTitle[orderState.delivery.method]}
          description={orderState.delivery.address}
        />
      </div>
      <div className="mt-6">
        <Products />
      </div>
      <div className="empty:hidden mt-6">
        <Errors field="delivery" />
      </div>
    </div>
  )
}

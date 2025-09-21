'use client'

import { MethodCard } from '@/components/MethodCard'
import { SpriteIcon } from '@/components/SpriteIcon'
import { TabMarker } from '@/components/TabMarker'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'
import { useOrderStore } from '@/providers/order-store-provider'
import { DeliveryService } from '@/types'

import css from './Delivery.module.css'
import { DeliveryPickupAddress } from './DeliveryPickupAddress'
import { DeliveryShippingAddress } from './DeliveryShippingAddress'
import { Errors } from './Errors'
import { Products } from './Products'

export function Delivery() {
  const orderState = useOrderStore((state) => state)

  const renderDeliveryAddress = () => {
    if (!orderState.delivery) {
      throw new Error('delivery not defined')
    }
    switch (orderState.delivery.service) {
      case DeliveryService.Shipping:
        return <DeliveryShippingAddress properties={orderState.delivery.properties} />
      case DeliveryService.Pickup:
        return <DeliveryPickupAddress properties={orderState.delivery.properties} />
      default:
        throw new Error('unknown delivery service')
    }
  }

  if (!orderState.delivery) {
    return (
      <div>
        <div className={cn(css.title, 'mb-4')}>Выберите способ получения</div>
        <Alert variant="destructive">
          <SpriteIcon name="exclamation-circle" size={16} />
          <AlertDescription>
            Пожалуйста, обратите внимание. В связи с большим объёмом заказов срок доставки может
            быть увеличен.
          </AlertDescription>
        </Alert>
        <div className="grid lg:grid-cols-2 gap-3 mt-3">
          <MethodCard
            title="Самовывоз"
            description="Из магазина или пункта выдачи"
            icon={<SpriteIcon name="self-pickup" size={40} />}
            action="/order/delivery/pickup"
          />
          <MethodCard
            title="Курьером"
            description="Доставка до вашей двери"
            icon={<SpriteIcon name="delivery" size={40} />}
            action="/order/delivery/shipping"
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
            { title: 'Курьером', name: DeliveryService.Shipping }
          ]}
          selected={orderState.delivery.service}
        />
      </div>
      <div className="mt-4">{renderDeliveryAddress()}</div>
      <div className="mt-6">
        <Products />
      </div>
      <div className="empty:hidden mt-6">
        <Errors field="delivery" />
      </div>
    </div>
  )
}

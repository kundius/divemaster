'use client'

import { useRouter } from 'next/navigation'

import { SpriteIcon } from '@/components/SpriteIcon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useOrderStore } from '@/providers/order-store-provider'
import { DeliveryMethod } from '@/types'

import { PointsDetails } from './PointsDetails'
import { PointsItem } from './PointsItem'
import css from './PointsList.module.scss'
import { usePointsQuery } from './PointsQuery'

export function PointsList() {
  const orderState = useOrderStore((state) => state)
  const router = useRouter()
  const { loading, rows, coverage, selected } = usePointsQuery()

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        {[0, 1, 2].map((n) => (
          <div key={n}>
            <div className="flex gap-4">
              <Skeleton className="rounded-full w-8 h-8" />
              <Skeleton className="flex-grow h-8" />
            </div>
            <div className="flex flex-col gap-1.5 mt-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (selected) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="pt-4">
          <PointsDetails entity={selected} />
        </div>
        <div className="flex-grow" />
        <div className="mt-6">
          <Button
            onClick={() => {
              orderState.setDelivery({
                method: DeliveryMethod.PICKUP,
                address: selected.fullAddress
              })
              router.push('/order')
            }}
            variant="default"
            size="lg"
            className="w-full uppercase font-sans-narrow"
          >
            Заберу отсюда
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {coverage === 'subject' && (
        <Alert variant="default" className={cn('mb-4', css.alert)}>
          <SpriteIcon name="exclamation-circle" size={14} />
          <AlertTitle>Внимание!</AlertTitle>
          <AlertDescription>
            К сожалению, рядом с вами пока нет пунктов выдачи заказов. Показаны пункты выдачи вашего
            региона.
          </AlertDescription>
        </Alert>
      )}
      <div className={cn('flex flex-col', css.scrollable)}>
        {rows.map((item) => (
          <PointsItem key={item.id} entity={item} />
        ))}
      </div>
    </div>
  )
}

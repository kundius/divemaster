import { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'
import { OrderStoreProvider } from '@/providers/order-store-provider'
import css from './page.module.scss'
import { PointsList } from './_components/PointsList'
import { DeliveryMethod } from '@/types'
import { TabMarker } from '@/components/TabMarker'
import { cn } from '@/lib/utils'
import { PointsQuery } from './_components/PointsQuery'
import { PointsMap } from './_components/PointsMap'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <PointsQuery>
      <Container>
        <div className={cn('flex gap-16', css.layout)}>
          <div className="w-1/3 py-12">
            <div className="mb-6">
              <Headline title="Способ получения" back={{ href: '/order', title: 'Назад' }} />
            </div>
            <TabMarker
              items={[
                { title: 'Самовывоз', name: DeliveryMethod.PICKUP },
                { title: 'Доставка', name: DeliveryMethod.SHIPPING }
              ]}
              size="lg"
              selected={DeliveryMethod.PICKUP}
            />
            <div className={cn('mt-6 overflow-auto', css.scrollable)}>
              <PointsList />
            </div>
          </div>
          <div className="w-2/3 relative">
            <div className={css.map}>
              <PointsMap />
            </div>
          </div>
        </div>
      </Container>
    </PointsQuery>
  )
}

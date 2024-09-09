import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { TabMarker } from '@/components/TabMarker'
import { DeliveryMethod } from '@/types'

import { Layout, LayoutContent, LayoutMap } from './_components/Layout'
import { PointsList } from './_components/PointsList'
import { PointsMap } from './_components/PointsMap'
import { PointsQuery } from './_components/PointsQuery'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <PointsQuery>
      <Layout>
        <LayoutContent>
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
          <div className="mt-6 flex-grow">
            <PointsList />
          </div>
        </LayoutContent>
        <LayoutMap>
          <PointsMap />
        </LayoutMap>
      </Layout>
    </PointsQuery>
  )
}

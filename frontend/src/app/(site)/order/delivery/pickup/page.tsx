import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { TabMarker } from '@/components/TabMarker'
import { DeliveryService } from '@/types'

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
          <PointsList />
        </LayoutContent>
        <LayoutMap>
          <PointsMap />
        </LayoutMap>
      </Layout>
    </PointsQuery>
  )
}

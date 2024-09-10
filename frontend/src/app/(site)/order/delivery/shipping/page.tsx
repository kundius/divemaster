import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { TabMarker } from '@/components/TabMarker'
import { DeliveryMethod } from '@/types'

import { Layout, LayoutContent, LayoutMap } from './_components/Layout'
import { ShippingForm } from './_components/ShippingForm'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
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
          selected={DeliveryMethod.SHIPPING}
        />
        <div className="mt-6 flex-grow">
          <ShippingForm />
        </div>
      </LayoutContent>
      <LayoutMap></LayoutMap>
    </Layout>
  )
}

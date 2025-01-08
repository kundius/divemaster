import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { TabMarker } from '@/components/TabMarker'
import { DeliveryService } from '@/types'

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
          <Headline title="Способ получения" back={{ action: '/order', title: 'Назад' }} />
        </div>
        <TabMarker
          items={[
            { title: 'Самовывоз', name: DeliveryService.Pickup },
            { title: 'Доставка', name: DeliveryService.Shipping }
          ]}
          size="lg"
          selected={DeliveryService.Shipping}
        />
        <div className="mt-6 flex-grow">
          <ShippingForm />
        </div>
      </LayoutContent>
      <LayoutMap></LayoutMap>
    </Layout>
  )
}

import { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'
import { OrderStoreProvider } from '@/providers/order-store-provider'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40">
      <Container small>
        <Headline className="mb-8" title="pickup" back={{ href: '/order', title: 'Назад' }} />
      </Container>
    </div>
  )
}
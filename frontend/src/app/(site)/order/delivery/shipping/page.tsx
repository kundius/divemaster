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
    <div className="pt-12 pb-40 overflow-hidden">
      <Container small>
        <Headline className="mb-8" title="shipping" back={{ href: '/order', title: 'Назад' }} />
      </Container>
    </div>
  )
}

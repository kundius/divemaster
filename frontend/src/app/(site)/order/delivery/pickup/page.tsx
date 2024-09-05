import { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'
import { OrderStoreProvider } from '@/providers/order-store-provider'
import css from './page.module.scss'
import { PickupPoints } from '../_components/PickupPoints'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <Container>
      <div className={css.layout}>
        <div className="w-1/3">
          <Headline className="mb-8" title="pickup" back={{ href: '/order', title: 'Назад' }} />
          <PickupPoints />
        </div>
        <div className="w-2/3 relative">
          <div className={css.map}></div>
        </div>
      </div>
    </Container>
  )
}

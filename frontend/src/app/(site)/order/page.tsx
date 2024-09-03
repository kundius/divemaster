import { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'

import { Agreement } from './_components/Agreement'
import { Agreements } from './_components/Agreements'
import { Authentication } from '../cart/_components/Authentication'
import { OrderInfo } from '../cart/_components/OrderInfo'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40">
      <Container small>
        <Headline
          className="mb-8"
          title="Оформление заказа"
          back={{ href: '/cart', title: 'Вернуться в корзину' }}
        />
        <div className="flex gap-20">
          <div className="w-2/3">order</div>
          <div className="w-1/3">
            <div className="sticky top-32 space-y-4">
              <OrderInfo />
              <Authentication />
              <Agreement />
              <Button className="w-full uppercase font-sans-narrow" size="lg" type="button">
                Оформить заказ
              </Button>
              <Agreements />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

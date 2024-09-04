import { Metadata } from 'next'

import { Container } from '@/components/site/Container'
import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'

import { Agreement } from './_components/Agreement'
import { Agreements } from './_components/Agreements'
import { Authentication } from '../cart/_components/Authentication'
import { OrderInfo } from '../cart/_components/OrderInfo'
import { Delivery } from './_components/Delivery'
import { RecipientDetails } from './_components/RecipientDetails'
import { Payment } from './_components/Payment'

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
          <div className="w-2/3 flex-grow">
            <div className="border rounded-xl divide-y">
              <div className="py-9 px-7">
                <Delivery />
              </div>
              <div className="py-9 px-7">
                <RecipientDetails />
              </div>
              <div className="py-9 px-7">
                <Payment />
              </div>
            </div>
          </div>
          <div className="w-1/3 max-w-[360px]">
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

import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'

import { Authentication } from '../cart/_components/Authentication'
import { OrderInfo } from '../cart/_components/OrderInfo'
import { Agreement } from './_components/Agreement'
import { Agreements } from './_components/Agreements'
import { Delivery } from './_components/Delivery'
import { Payment } from './_components/Payment'
import { Recipient } from './_components/Recipient'
import { Submit } from './_components/Submit'

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
                <Recipient />
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
              <Submit />
              <Agreements />
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

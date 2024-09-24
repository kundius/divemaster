import { Metadata } from 'next'

import { Headline } from '@/components/Headline'
import { Container } from '@/components/site/Container'

import { Authentication } from '../cart/_components/Authentication'
import { Agreement } from './_components/Agreement'
import { Agreements } from './_components/Agreements'
import { Delivery } from './_components/Delivery'
import { Payment } from './_components/Payment'
import { Recipient } from './_components/Recipient'
import { Submit } from './_components/Submit'
import { OrderInfoContainer } from './_components/OrderInfoContainer'

export const metadata: Metadata = {
  title: 'Оформление заказа'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40 max-md:pt-6 max-md:pb-20 max-lg:pt-8 max-lg:pb-24">
      <Container small>
        <Headline
          className="mb-8 max-md:mb-6"
          title="Оформление заказа"
          back={{ href: '/cart', title: 'Вернуться в корзину' }}
        />
        <div className="flex gap-20 max-md:flex-col max-md:gap-8 max-lg:gap-6 max-xl:gap-10">
          <div className="flex-grow w-full">
            <div className="border rounded-xl divide-y">
              <div className="px-7 py-9 max-lg:px-5 max-lg:py-5 max-md:px-2 max-md:py-6">
                <Delivery />
              </div>
              <div className="py-9 px-7 max-lg:px-5 max-lg:py-5 max-md:px-2 max-md:py-6">
                <Recipient />
              </div>
              <div className="py-9 px-7 max-lg:px-5 max-lg:py-5 max-md:px-2 max-md:py-6">
                <Payment />
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full md:w-[280px] lg:w-[300px] xl:w-[360px]">
            <div className="sticky top-32 space-y-4">
              <OrderInfoContainer />
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

import { Metadata } from 'next'

import { Container } from '@/components/site/Container'

import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'
import { Authentication } from './_components/Authentication'
import { CartHeadline } from './_components/CartHeadline'
import { EmptyFallback } from './_components/EmptyFallback'
import { LegalEntity } from './_components/LegalEntity'
import { OrderInfo } from './_components/OrderInfo'
import { Products } from './_components/Products'
import { TmpBuye } from './_components/TmpBuye'

export const metadata: Metadata = {
  title: 'Корзина'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40">
      <Container small>
        <EmptyFallback>
          <Headline className="mb-8" title="Корзина" />
          <div className="flex gap-20">
            <div className="w-2/3">
              <CartHeadline />
              <Products />
            </div>
            <div className="w-1/3">
              <div className="sticky top-32 space-y-4">
                <OrderInfo />
                <Authentication />
                {/* <Button className="w-full uppercase font-sans-narrow" size="lg" type="button">
                  Перейти к оформлению
                </Button> */}
                <TmpBuye />
                <LegalEntity />
              </div>
            </div>
          </div>
        </EmptyFallback>
      </Container>
    </div>
  )
}

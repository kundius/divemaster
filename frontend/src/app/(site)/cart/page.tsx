import { Metadata } from 'next'

import { Container } from '@/components/site/Container'

import { Headline } from '@/components/Headline'
import { Button } from '@/components/ui/button'
import { Authentication } from './_components/Authentication'
import { CartHeadline } from './_components/CartHeadline'
import { EmptyFallback } from './_components/EmptyFallback'
import { LegalEntity } from './_components/LegalEntity'
import { OrderInfoContainer } from './_components/OrderInfoContainer'
import { Products } from './_components/Products'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Корзина'
}

export default function Page() {
  return (
    <div className="pt-12 pb-40 max-md:pt-6 max-md:pb-20 max-lg:pt-8 max-lg:pb-24">
      <Container small>
        <EmptyFallback>
          <Headline className="mb-8 max-md:mb-6" title="Корзина" />
          <div className="flex gap-20 max-xl:gap-10 max-md:flex-col max-md:gap-8">
            <div className="w-2/3 flex-grow max-lg:w-3/5 max-md:w-full">
              <CartHeadline />
              <Products />
            </div>
            <div className="w-1/3 md:max-w-[360px] max-lg:w-2/5 max-md:w-full">
              <div className="sticky top-32 space-y-4">
                <OrderInfoContainer />
                <Authentication />
                <Button
                  asChild
                  className="w-full uppercase font-sans-narrow"
                  size="lg"
                  type="button"
                >
                  <Link href="/order">Перейти к оформлению</Link>
                </Button>
                <LegalEntity />
              </div>
            </div>
          </div>
        </EmptyFallback>
      </Container>
    </div>
  )
}

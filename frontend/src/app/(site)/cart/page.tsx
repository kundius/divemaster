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
    <div className="pt-12 pb-40">
      <Container small>
        <EmptyFallback>
          <Headline className="mb-8" title="Корзина" />
          <div className="flex gap-20">
            <div className="w-2/3 flex-grow">
              <CartHeadline />
              <Products />
            </div>
            <div className="w-1/3 max-w-[360px]">
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

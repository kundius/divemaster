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
import { SectionPage } from '@/components/SectionPage'

export const metadata: Metadata = {
  title: 'Корзина'
}

export default function Page() {
  return (
    <SectionPage>
      <div className="max-w-7xl mx-auto">
        <EmptyFallback>
          <Headline className="mb-8 max-md:mb-6" title="Корзина" />
          <div className="flex gap-20 max-md:flex-col max-md:gap-8 max-lg:gap-6 max-xl:gap-10">
            <div className="flex-grow w-full">
              <CartHeadline />
              <Products />
            </div>
            <div className="flex-shrink-0 w-full md:w-[280px] lg:w-[300px] xl:w-[360px]">
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
      </div>
    </SectionPage>
  )
}

import { ConsultationWidget } from '@/components/ConsultationWidget'
import { SectionPage } from '@/components/SectionPage'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import type { Metadata } from 'next'
import { BenefitsSideSlider, BenefitsSideSliderDiscount } from '../_components/BenefitsSideSlider'
import { ProductsFilter } from '../_components/ProductsFilter'
import { ProductsList } from '../_components/ProductsList'
import { ProductsPagination } from '../_components/ProductsPagination'
import { ProductsSorting } from '../_components/ProductsSorting'
import { SearchHeadline } from './_components/SearchHeadline'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Поиск'
}

export default async function Page() {
  return (
    <SectionPage>
      <Suspense>
        <ProductsStoreProvider>
          <SearchHeadline />

          <div className="flex gap-x-5 mt-14">
            <div className="w-[320px] max-xl:w-[260px] flex-shrink-0 space-y-5 max-lg:hidden">
              <div className="mb-80">
                <ProductsFilter />
              </div>
              <ConsultationWidget />
              <BenefitsSideSlider
                items={[
                  {
                    content: <BenefitsSideSliderDiscount />,
                    name: 'BenefitsSideSliderDiscount1'
                  },
                  {
                    content: <BenefitsSideSliderDiscount />,
                    name: 'BenefitsSideSliderDiscount2'
                  },
                  {
                    content: <BenefitsSideSliderDiscount />,
                    name: 'BenefitsSideSliderDiscount3'
                  }
                ]}
              />
            </div>
            <div className="w-full">
              <div className="hidden">
                <ProductsSorting />
              </div>
              <ProductsList />
              <ProductsPagination />
            </div>
          </div>
        </ProductsStoreProvider>
      </Suspense>
    </SectionPage>
  )
}

import type { Metadata } from 'next'
import { Breadcrumbs, BreadcrumbsProps } from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import { CategoryEntity, FindAllResult, PageProps } from '@/types'
import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { Suspense } from 'react'
import { ConsultationWidget } from '@/components/ConsultationWidget'
import { BenefitsSideSlider, BenefitsSideSliderDiscount } from '../_components/BenefitsSideSlider'
import { ProductsSorting } from '../_components/ProductsSorting'
import { ProductsList } from '../_components/ProductsList'
import { ProductsFilter } from '../_components/ProductsFilter'
import { ProductsPagination } from '../_components/ProductsPagination'
import { SearchProductsStoreProvider } from './_components/SearchProductsStoreProvider'
import { SearchHeadline } from './_components/SearchHeadline'

export const metadata: Metadata = {
  title: 'Поиск'
}

export default async function Page() {
  return (
    <SectionPage>
      <SearchProductsStoreProvider>
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
      </SearchProductsStoreProvider>
    </SectionPage>
  )
}

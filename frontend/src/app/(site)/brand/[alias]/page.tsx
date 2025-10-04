import type { Metadata } from 'next'

import { BreadcrumbsProps } from '@/components/Breadcrumbs'
import { ConsultationWidget } from '@/components/ConsultationWidget'
import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { apiGet } from '@/lib/api'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import { BrandEntity, FindAllResult, PageProps } from '@/types'
import { Suspense } from 'react'
import {
  BenefitsSideSlider,
  BenefitsSideSliderDiscount
} from '../../_components/BenefitsSideSlider'
import { ProductsFilter } from '../../_components/ProductsFilter'
import { ProductsList } from '../../_components/ProductsList'
import { ProductsPagination } from '../../_components/ProductsPagination'
import { ProductsSorting } from '../../_components/ProductsSorting'

export async function generateStaticParams() {
  const brands = await apiGet<FindAllResult<BrandEntity>>(`brands`, { limit: 100 })
  return brands.rows.filter((n) => !!n.alias).map((n) => ({ alias: n.alias }))
}

export async function generateMetadata({
  params
}: PageProps<{ alias: string }>): Promise<Metadata> {
  const { alias } = await params
  const brand = await apiGet<BrandEntity>(`brands/alias:${alias}`)
  return { title: brand.name }
}

export default async function Page({ params }: PageProps<{ alias: string }>) {
  const { alias } = await params
  const brand = await apiGet<BrandEntity>(`brands/alias:${alias}`, {})

  const crumbs: BreadcrumbsProps['items'] = [
    {
      title: 'Главная',
      href: '/'
    },
    {
      title: 'Каталог',
      href: '/catalog'
    }
  ]

  return (
    <SectionPage withBreadcrumbs>
      <Headline breadcrumbs={crumbs} separator title={brand.name} />

      <Suspense>
        <ProductsStoreProvider initialBaseParams={{ brand: brand.id }}>
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
      {brand.description && <div className="mx-auto prose lg:prose-xl">{brand.description}</div>}
    </SectionPage>
  )
}

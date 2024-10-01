import {
  BenefitsSideSlider,
  BenefitsSideSliderDiscount
} from '@/components/site/BenefitsSideSlider'
import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import { ConsultationWidget } from '@/components/site/ConsultationWidget'
import { Container } from '@/components/site/Container'
import { ProductsStoreProvider } from '@/providers/products-store-provider'

import { Pagination } from './_components/Pagination'
import { Products } from './_components/Products'
import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'

export default async function Page() {
  const crumbs: BreadcrumbsProps['items'] = [
    {
      title: 'Главная',
      href: '/'
    }
  ]

  return (
    <ProductsStoreProvider favorite>
      <SectionPage withBreadcrumbs>
        <Headline breadcrumbs={crumbs} separator title="Каталог" />

        <div className="flex gap-x-5 mt-14">
          <div className="w-1/5 space-y-5 max-2xl:w-1/4">
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
          <div className="w-4/5 max-2xl:w-3/4">
            <div className="mb-6 text-xl font-sans-narrow uppercase font-bold">
              Популярные товары
            </div>
            <Products />
            <Pagination />
          </div>
        </div>
      </SectionPage>
    </ProductsStoreProvider>
  )
}

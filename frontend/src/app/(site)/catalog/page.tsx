import {
  BenefitsSideSlider,
  BenefitsSideSliderDiscount
} from '@/components/site/BenefitsSideSlider'
import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import { ConsultationWidget } from '@/components/site/ConsultationWidget'
import { Container } from '@/components/site/Container'
import { Pagination } from './_components/Pagination'
import { Products } from './_components/Products'
import { ProductsQuery } from './_components/ProductsQuery'
import { Suspense } from 'react'

export default async function Page() {
  const crumbs: BreadcrumbsProps['items'] = [
    {
      title: 'Главная',
      href: '/'
    }
  ]

  return (
    <Suspense>
      <ProductsQuery>
        <Container>
          <div className="pb-3 pt-6 border-b border-neutral-100">
            <Breadcrumbs items={crumbs} />
            <div className="mt-2 text-4xl font-sans-narrow uppercase font-bold">Каталог</div>
          </div>

          <div className="flex gap-x-5 mb-40 mt-14">
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
        </Container>
      </ProductsQuery>
    </Suspense>
  )
}

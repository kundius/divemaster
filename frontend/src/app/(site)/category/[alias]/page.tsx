import type { Metadata } from 'next'

import { Breadcrumbs, BreadcrumbsProps } from '@/components/Breadcrumbs'
import { Container } from '@/components/Container'
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import { CategoryEntity, FindAllResult, PageProps } from '@/types'
import { CategoryCard } from './_components/CategoryCard'
import { Filter } from './_components/Filter'
import { Sorting } from './_components/Sorting'
import { Products } from './_components/Products'
import { Pagination } from './_components/Pagination'
import { Content } from './_components/Content'
import { Headline } from '@/components/Headline'
import { SectionPage } from '@/components/SectionPage'
import { Suspense } from 'react'
import { ConsultationWidget } from '@/components/ConsultationWidget'
import {
  BenefitsSideSlider,
  BenefitsSideSliderDiscount
} from '../../_components/BenefitsSideSlider'

export async function generateStaticParams() {
  const categories = await apiGet<FindAllResult<CategoryEntity>>(`categories`, { limit: 100 })
  return categories.rows.map(({ alias }) => ({ alias }))
}

export async function generateMetadata({
  params
}: PageProps<{ alias: string }>): Promise<Metadata> {
  const { alias } = await params
  const category = await apiGet<CategoryEntity>(`categories/alias:${alias}`)
  return { title: category.title }
}

export default async function Page({ params }: PageProps<{ alias: string }>) {
  const { alias } = await params
  const [category, categories] = await Promise.all([
    apiGet<CategoryEntity>(`categories/alias:${alias}`, {}),
    apiGet<FindAllResult<CategoryEntity>>(`categories`, { limit: 100 })
  ])

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

  // TODO: вынести на сервер, что-то вроде parents категории
  const addCategory = (c: CategoryEntity) => {
    if (c.parentId) {
      const parent = categories.rows.find((i) => i.id === c.parentId)
      if (parent) {
        addCategory(parent)
      }
    }
    crumbs.push({
      title: c.title,
      href: `/category/${c.alias}`
    })
  }

  addCategory(category)

  const child = categories.rows.filter((i) => i.parentId === category.id)
  const hasChild = child.length > 0

  return (
    <>
      <SectionPage withBreadcrumbs>
        <Headline breadcrumbs={crumbs} separator title={category.title} />

        {hasChild && (
          <div className="grid grid-cols-5 gap-x-5 mt-10 gap-y-16 pb-10 border-b mb-14 border-neutral-100 max-2xl:grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-2">
            {child.map((item) => (
              <CategoryCard
                key={item.id}
                title={item.title}
                href={`/category/${item.alias}`}
                image={!!item.imageId ? getFileUrl(item.imageId) : '/noimage.png'}
              />
            ))}
          </div>
        )}

        <Suspense>
          <ProductsStoreProvider params={{ category: category.id }}>
            <div className="flex gap-x-5 mt-14">
              <div className="w-[320px] max-xl:w-[260px] flex-shrink-0 space-y-5 max-lg:hidden">
                {!hasChild && (
                  <div className="mb-80">
                    <Filter />
                  </div>
                )}
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
                  {hasChild ? (
                    <div className="mb-6 text-xl font-sans-narrow uppercase font-bold">
                      Популярные товары
                    </div>
                  ) : (
                    <Sorting />
                  )}
                </div>
                <Products />
                <Pagination />
              </div>
            </div>
          </ProductsStoreProvider>
        </Suspense>
      </SectionPage>
      <Container>
        <Content
          title={category.longTitle || undefined}
          content={category.description || undefined}
        />
      </Container>
    </>
  )
}

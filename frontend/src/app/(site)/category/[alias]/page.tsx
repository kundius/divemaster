import type { Metadata } from 'next'

import {
  BenefitsSideSlider,
  BenefitsSideSliderDiscount
} from '@/components/site/BenefitsSideSlider'
import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import { ConsultationWidget } from '@/components/site/ConsultationWidget'
import { Container } from '@/components/site/Container'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { ProductsStoreProvider } from '@/providers/products-store-provider'
import { CategoryEntity } from '@/types'
import { CategoryCard } from './_components/CategoryCard'
import { Filter } from './_components/Filter'
import { Sorting } from './_components/Sorting'
import { Products } from './_components/Products'
import { Pagination } from './_components/Pagination'
import { Content } from './_components/Content'
import { Headline } from '@/components/Headline'

export async function generateStaticParams() {
  const categories = await apiGet<ApiTableData<CategoryEntity>>(`categories`, {
    limit: 100
  })
  return categories.rows.map(({ alias }) => ({ alias }))
}

export async function generateMetadata({
  params: { alias }
}: {
  params: { alias: string }
}): Promise<Metadata> {
  const category = await apiGet<CategoryEntity>(
    `categories/alias:${alias}`,
    {
      withParent: true,
      withChildren: true,
      active: true
    },
    {
      next: {
        revalidate: 60 * 5
      }
    }
  )
  return {
    title: category.title
  }
}

export default async function Page({ params: { alias } }: { params: { alias: string } }) {
  const category = await apiGet<CategoryEntity>(
    `categories/alias:${alias}`,
    {
      withParent: true,
      withChildren: true,
      active: true
    },
    {
      next: {
        revalidate: 60 * 5
      }
    }
  )

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
  const addParents = (category: CategoryEntity) => {
    if (!!category.parent && typeof category.parent === 'object') {
      addParents(category.parent)
      crumbs.push({
        title: category.parent.title,
        href: `/category/${category.parent.alias}`
      })
    }
  }

  addParents(category)

  const isParent = category.children ? category.children.length > 0 : false

  return (
    <ProductsStoreProvider categoryId={category.id} favorite={isParent}>
      <div className="pt-6 pb-40 max-md:pb-20 max-lg:pb-24">
        <Container>
          <Headline breadcrumbs={crumbs} separator title={category.title} />

          {isParent && (
            <div className="grid grid-cols-5 gap-x-5 mt-10 gap-y-16 pb-10 border-b mb-14 border-neutral-100 max-2xl:grid-cols-4">
              {category.children?.map((item) => (
                <CategoryCard
                  key={item.id}
                  title={item.title}
                  href={`/category/${item.alias}`}
                  image={!!item.image ? getFileUrl(item.image) : '/noimage.png'}
                />
              ))}
            </div>
          )}

          <div className="flex gap-x-5 mt-14">
            <div className="w-1/5 max-2xl:w-1/4 space-y-5 max-lg:hidden">
              {!isParent && (
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
            <div className="w-4/5 max-2xl:w-3/4 max-lg:w-full">
              {isParent ? (
                <div className="mb-6 text-xl font-sans-narrow uppercase font-bold">
                  Популярные товары
                </div>
              ) : (
                <Sorting />
              )}
              <Products />
              <Pagination />
            </div>
          </div>

          <Content
            title={category.longTitle || undefined}
            content={category.description || undefined}
          />
        </Container>
      </div>
    </ProductsStoreProvider>
  )
}

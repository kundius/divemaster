import { ApiTableData } from '@/components/lib/ApiTable/types'
import { Resorces, ResorcesProps } from '@/components/lib/Resources'
import { ResorcesSyncParams } from '@/components/lib/Resources/SyncSearchParams'
import {
  BenefitsSideSlider,
  BenefitsSideSliderDiscount
} from '@/components/site/BenefitsSideSlider'
import { CategoryCard } from '@/components/site/CategoryCard'
import { CategoryContent } from '@/components/site/CategoryContent'
import { CategoryPagination } from '@/components/site/CategoryPagination'
import { CategoryProducts } from '@/components/site/CategoryProducts'
import { ConsultationWidget } from '@/components/site/ConsultationWidget'
import { Container } from '@/components/site/Container'
import { PageHeadline, PageHeadlineCrumb } from '@/components/site/PageHeadline'
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { CategoryEntity, ProductEntity } from '@/types'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export async function generateStaticParams() {
  const categories = await apiGet<ApiTableData<CategoryEntity>>(`categories`, { all: true, active: true })
  return categories.rows.map(({ alias }) => ({ alias }))
}

export default async function Page({ params: { alias } }: { params: { alias: string } }) {
  // TODO: HIERARCHY_DEPTH_LIMIT
  // в populate указана необходимая вложенность родителей
  const category = await apiGet<CategoryEntity>(`categories/alias:${alias}`, {
    populate: ['children', 'parent', 'parent.parent'],
    filters: ['active']
  })

  if (!category.active) {
    notFound()
  }

  const crumbs: PageHeadlineCrumb[] = [
    {
      title: 'Главная',
      href: '/'
    },
    {
      title: 'Каталог',
      href: '/catalog'
    }
  ]

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

  crumbs.push({
    title: category.title
  })

  const isParent = category.children && category.children.length > 0

  const params: ResorcesProps<ProductEntity>['defaultParams'] = {
    limit: 24,
    category: category.id,
    populate: ['images', 'brand'],
    filters: ['active']
  }

  // if (isParent) {
  //   params.filters.push('favorite')
  // }

  return (
    <Resorces<ProductEntity> url="products" defaultParams={params}>
      <Container>
        <Suspense fallback="loading">
          <ResorcesSyncParams />
        </Suspense>

        <PageHeadline
          title={category.title}
          crumbs={crumbs}
          titleView={!!category.longTitle ? 'div' : 'h1'}
        />

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
            <CategoryProducts />
            <CategoryPagination />
          </div>
        </div>
        <CategoryContent
          title={category.longTitle || undefined}
          content={category.description || undefined}
        />
      </Container>
    </Resorces>
  )
}

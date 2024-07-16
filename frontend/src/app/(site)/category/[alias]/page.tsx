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
import { CategoryEntity } from '@/types'
import { CategoryCard } from './_components/CategoryCard'
import { CategoryContent } from './_components/CategoryContent'
import { CategoryPagination } from './_components/CategoryPagination'
import { CategoryProducts } from './_components/CategoryProducts'
import { Filter } from './_components/Filter'
import { ProductsQuery } from './_components/ProductsQuery'
import { ProductsSorting } from './_components/ProductsSorting'
import { Test } from './_components/Test'

export async function generateStaticParams() {
  const categories = await apiGet<ApiTableData<CategoryEntity>>(`categories`, {
    all: true,
    filters: ['active']
  })
  return categories.rows.map(({ alias }) => ({ alias }))
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
    <ProductsQuery categoryId={category.id} isParent={isParent}>
      <Container>
        <div className="pb-3 pt-6 border-b border-neutral-100">
          <Breadcrumbs items={crumbs} />
          <div className="mt-2 text-4xl font-sans-narrow uppercase font-bold">{category.title}</div>
        </div>

        <Test />

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
          <div className="w-4/5 max-2xl:w-3/4">
            {isParent ? (
              <div className="mb-6 text-xl font-sans-narrow uppercase font-bold">
                Популярные товары
              </div>
            ) : (
              <ProductsSorting />
            )}
            <CategoryProducts />
            <CategoryPagination />
          </div>
        </div>
        <CategoryContent
          title={category.longTitle || undefined}
          content={category.description || undefined}
        />
      </Container>
    </ProductsQuery>
  )
}

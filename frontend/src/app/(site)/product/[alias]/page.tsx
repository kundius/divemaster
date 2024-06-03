import { ApiTableData } from '@/lib/ApiTable/types'
import { Resorces, ResorcesProps } from '@/lib/Resources'
import { ResorcesSyncParams } from '@/lib/Resources/SyncSearchParams'
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
import { apiGet } from '@/lib/api'
import { getFileUrl } from '@/lib/utils'
import { CategoryEntity, ProductEntity } from '@/types'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'

export async function generateStaticParams() {
  const categories = await apiGet<ApiTableData<ProductEntity>>(`products`, {
    all: true,
    filters: ['active']
  })
  return categories.rows.map(({ alias }) => ({ alias }))
}

export default async function Page({ params: { alias } }: { params: { alias: string } }) {
  const [product] = await Promise.all([
    apiGet<ProductEntity>(`products/alias:${alias}`, {
      populate: ['categories', 'images', 'brand'],
      filters: ['active']
    })
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

  const addParents = (categories: CategoryEntity[], parent: number | null) => {
    for (const category of categories) {
      if (category.parent === parent) {
        crumbs.push({
          title: category.title,
          href: `/category/${category.alias}`
        })
        addParents(categories, category.id)
        break
      }
    }
  }
  if (product.categories) {
    addParents(product.categories, null)
  }

  return (
    <Container>
      <div className="pb-6 pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      {product.title}
    </Container>
  )
}

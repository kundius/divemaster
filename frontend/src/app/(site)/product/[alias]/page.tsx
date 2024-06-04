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
import { displayPrice, getFileUrl } from '@/lib/utils'
import { CategoryEntity, ProductEntity } from '@/types'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import styles from '@/components/site/ProductPage/index.module.scss'
import { ListActions } from '@/components/site/ProductPage/ListActions'
import { ReviewsShort } from '@/components/site/ProductPage/ReviewsShort'
import { SpecButton } from '@/components/site/ProductPage/SpecButton'
import { CartActions } from '@/components/site/ProductPage/CartActions'
import { DeliveryInfo } from '@/components/site/ProductPage/DeliveryInfo'
import { Warranty } from '@/components/site/ProductPage/Warranty'

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

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.price) * 100)
    : 0

  return (
    <Container>
      <div className="pb-6 pt-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <div className={styles.layout}>
        <div className={styles.layoutGallery}>gallery</div>
        <div className={styles.layoutInfo}>
          <div className="flex items-center justify-between">
            {!!product.brand && typeof product.brand === 'object' && (
              <div className={styles.brand}>{product.brand.title}</div>
            )}
            <div />
            <ListActions />
          </div>
          <h1 className={styles.title}>{product.longTitle || product.title}</h1>
          {!!product.sku && <div className={styles.sku}>{product.sku}</div>}
          <div className="flex justify-between items-center gap-8 max-w-96">
            <ReviewsShort count={0} rating={4} />
            <SpecButton />
          </div>
          <div className={styles.prices}>
            {discount > 0 && <div className={styles.discount}>-{discount}%</div>}
            {product.oldPrice && <div className={styles.oldPrice}>{displayPrice(product.oldPrice)}</div>}
            <div className={styles.realPrice}>{displayPrice(product.price)}</div>
          </div>
          <CartActions />
          <DeliveryInfo />
        </div>
        <div className={styles.layoutWarranty}>
          <Warranty />
        </div>
        <div className={styles.layoutContent}>layoutContent</div>
      </div>
    </Container>
  )
}

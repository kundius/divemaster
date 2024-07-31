import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import { Container } from '@/components/site/Container'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { cn, getFileUrl } from '@/lib/utils'
import { CategoryEntity, ProductEntity } from '@/types'
import { AddToCart } from './_components/AddToCart'
import { DeliveryInfo } from './_components/DeliveryInfo'
import { Description } from './_components/Description'
import { Gallery } from './_components/Gallery'
import { ListActions } from './_components/ListActions'
import { ReviewsShort } from './_components/ReviewsShort'
import { SpecButton } from './_components/SpecButton'
import { Warranty } from './_components/Warranty'
import styles from './_components/page.module.scss'

export async function generateStaticParams() {
  const products = await apiGet<ApiTableData<ProductEntity>>(`products`, {
    all: true,
    filters: ['active']
  })
  return products.rows.map(({ alias }) => ({ alias }))
}

export default async function Page({ params: { alias } }: { params: { alias: string } }) {
  const [product] = await Promise.all([
    apiGet<ProductEntity>(
      `products/alias:${alias}`,
      {
        active: true,
        withContent: true,
        withBrand: true,
        withOptions: true,
        withOffers: true,
        withImages: true,
        withCategories: true
      },
      {
        next: {
          revalidate: 60 * 5
        }
      }
    )
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
      <div className={cn(styles.layout, 'mb-40')}>
        <div className={styles.layoutGallery}>
          <Gallery items={product.images?.map((item) => getFileUrl(item.file)) || []} />
        </div>
        <div className={styles.layoutInfo}>
          <div className="flex items-center justify-between mb-2">
            {!!product.brand && typeof product.brand === 'object' && (
              <div className={styles.brand}>{product.brand.title}</div>
            )}
            <div />
            <ListActions />
          </div>
          <h1 className={styles.title}>{product.longTitle || product.title}</h1>
          {!!product.sku && <div className={styles.sku}>{product.sku}</div>}
          <div className="flex justify-between items-center gap-8 max-w-96 mt-3">
            <ReviewsShort count={0} rating={4} />
            {product.specifications && <SpecButton />}
          </div>
          <div className="mt-3">
            <AddToCart product={product} />
          </div>
          <div className="mt-10">
            <DeliveryInfo />
          </div>
        </div>
        <div className={styles.layoutWarranty}>
          <Warranty />
        </div>
        <div className={cn(styles.layoutContent, 'space-y-24')}>
          {product.description && <Description title="Описание" content={product.description} />}
          {product.specifications && (
            <Description title="Характеристики" content={product.specifications} />
          )}
          {product.exploitation && (
            <Description title="Правила эксплуатации" content={product.exploitation} />
          )}
        </div>
      </div>
    </Container>
  )
}

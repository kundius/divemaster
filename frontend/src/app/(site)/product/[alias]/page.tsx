import { Breadcrumbs, BreadcrumbsProps } from '@/components/site/Breadcrumbs'
import { Container } from '@/components/site/Container'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { cn, getFileUrl } from '@/lib/utils'
import { CategoryEntity, PageProps, ProductEntity } from '@/types'
import { AddToCart } from './_components/AddToCart'
import { DeliveryInfo } from './_components/DeliveryInfo'
import { Description } from './_components/Description'
import { Gallery } from './_components/Gallery'
import { ListActions } from './_components/ListActions'
import { ReviewsShort } from './_components/ReviewsShort'
import { SpecButton } from './_components/SpecButton'
import { Warranty } from './_components/Warranty'
import styles from './_components/page.module.scss'
import { ProductStoreProvider } from '@/providers/product-store-provider'
import { Title } from './_components/Title'
import type { Metadata } from 'next'
import { SectionPage } from '@/components/SectionPage'

// export async function generateStaticParams() {
//   const products = await apiGet<ApiTableData<ProductEntity>>(`products`, {
//     limit: 100
//   })
//   return products.rows.map(({ alias }) => ({ alias }))
// }

export async function generateMetadata({
  params
}: PageProps<{ alias: string }>): Promise<Metadata> {
  const { alias } = await params
  const product = await apiGet<ProductEntity>(`products/alias:${alias}`, {
    active: true
  })
  return {
    title: product.title
  }
}

export default async function Page({ params }: PageProps<{ alias: string }>) {
  const { alias } = await params
  const [product] = await Promise.all([
    apiGet<ProductEntity>(
      `products/alias:${alias}`,
      {},
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

  // TODO: вынести на сервер, что-то вроде parents или сразу breadcrumbs
  const addParents = (categories: CategoryEntity[], parentId: number | null) => {
    for (const category of categories) {
      if (!category) continue
      if (category.parentId === parentId) {
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
    <ProductStoreProvider product={product}>
      <SectionPage withBreadcrumbs>
        <div className="pb-6 max-md:pb-2 max-md:border-b">
          <Breadcrumbs items={crumbs} />
        </div>
        <div className={cn(styles.layout, 'mb-40')}>
          <div className={styles.layoutGallery}>
            <Gallery items={product.images?.map((item) => getFileUrl(item.fileId)) || []} />
          </div>
          <div className={styles.layoutInfo}>
            <div className="flex items-center justify-between mb-2 max-md:mb-1">
              {!!product.brand && typeof product.brand === 'object' && (
                <div className={styles.brand}>{product.brand.title}</div>
              )}
              <div />
              <ListActions />
            </div>
            <div className={styles.title}>
              <Title />
            </div>
            {!!product.sku && <div className={styles.sku}>{product.sku}</div>}
            <div className="flex justify-between items-center gap-8 max-w-96 mt-3">
              <ReviewsShort count={0} rating={4} />
              {product.specifications && <SpecButton />}
            </div>
            <div className="mt-3 max-md:mt-7">
              <AddToCart />
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
      </SectionPage>
    </ProductStoreProvider>
  )
}

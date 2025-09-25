import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PageProps, ProductEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { ProductList } from './_components/ProductList'

export const metadata: Metadata = {
  title: 'Товары'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<ProductEntity>>('products', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Товары</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/products/create">Добавить товар</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <ProductList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}

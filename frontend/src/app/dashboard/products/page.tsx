import type { Metadata } from 'next'
import Link from 'next/link'

import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { FindAllResult, PageProps, ProductEntity } from '@/types'

import { ProductList } from './_components/ProductList'

export const metadata: Metadata = {
  title: 'Товары'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<ProductEntity>>(
    'products',
    await searchParams,
    await withServerAuth()
  )

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/products/create">Добавить товар</Link>
    </Button>
  ]

  return (
    <PageLayout title="Товары" actions={actions}>
      <ProductList fallbackData={fallbackData} />
    </PageLayout>
  )
}

import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, ProductEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductTable } from './_components/ProductTable'

export const metadata: Metadata = {
  title: 'Товары'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<ApiTableData<ProductEntity>>(
    'products',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return (
    <PageLayout
      title="Товары"
      actions={
        <Link href="/dashboard/products/create">
          <Button>Добавить товар</Button>
        </Link>
      }
    >
      <ProductTable initialData={initialData} />
    </PageLayout>
  )
}

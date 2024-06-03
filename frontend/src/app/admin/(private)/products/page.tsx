import { ProductsPage } from '@/components/admin/ProductsPage'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, ProductEntity } from '@/types'
import type { Metadata } from 'next'

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

  return <ProductsPage initialData={initialData} />
}

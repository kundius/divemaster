import { ProductsPage } from '@/components/admin/ProductsPage'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, VespProduct } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Товары'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespProduct>>(
    'products',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return <ProductsPage initialData={initialData} />
}

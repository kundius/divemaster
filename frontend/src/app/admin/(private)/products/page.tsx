import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { VespTable } from '@/components/vesp/VespTable'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { PageProps, VespProduct } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Товары'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespProduct>>(
    'admin/products',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withAuth()
  )

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/products/create" key="create">
      <Button>Добавить товар</Button>
    </Link>
  ]

  return (
    <VespTable<VespProduct> url="admin/products" initialData={initialData}>
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <ProductsTable />
    </VespTable>
  )
}

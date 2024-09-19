import { PageLayout } from '@/components/admin/PageLayout'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { ApiTableData } from '@/lib/ApiTable/types'
import { PageProps, ProductEntity } from '@/types'
import type { Metadata } from 'next'
import { OrdersPagination } from './_components/Pagination'

import { createSearchParamsCache, parseAsInteger, parseAsString } from 'nuqs/server'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table'

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1)
})

export const metadata: Metadata = {
  title: 'Заказы'
}

export default async function Page(props: PageProps) {
  const { page } = searchParamsCache.parse(props.searchParams)
  const initialData = await apiGet<ApiTableData<ProductEntity>>(
    'products',
    {
      limit: 10,
      page
    },
    withServerAuth()
  )
  return (
    <PageLayout title="Заказы">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialData.rows.map((row, i) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <OrdersPagination page={page} limit={20} total={initialData.total} />
    </PageLayout>
  )
}

import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { CategoriesTable } from '@/components/admin/CategoriesTable'
import { VespTable } from '@/components/vesp/VespTable'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { PageProps, VespCategory } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Категории'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespCategory>>(
    'admin/categories',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withAuth()
  )

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/categories/create" key="create">
      <Button>Добавить категорию</Button>
    </Link>
  ]

  return (
    <VespTable<VespCategory> url="admin/categories" initialData={initialData}>
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <CategoriesTable />
    </VespTable>
  )
}

import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { UsersTable } from '@/components/admin/UsersTable'
import { VespTable } from '@/components/admin/VespTable'
import { DEFAULT_LIMIT } from '@/components/admin/VespTable/constants'
import { VespTableData } from '@/components/admin/VespTable/types'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { PageProps, VespUser } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Пользователи'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespUser>>(
    'admin/users',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withAuth()
  )

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/users/create" key="create">
      <Button>Добавить пользователя</Button>
    </Link>
  ]

  return (
    <VespTable<VespUser> url="admin/users" initialData={initialData}>
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UsersTable />
    </VespTable>
  )
}

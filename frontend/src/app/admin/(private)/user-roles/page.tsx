import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { UserRolesTable } from '@/components/admin/UserRolesTable'
import { VespTable } from '@/components/vesp/VespTable'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { PageProps, VespUserRole } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Роли пользователей'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespUserRole>>(
    'admin/user-roles',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withAuth()
  )

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/user-roles/create" key="create">
      <Button>Добавить роль</Button>
    </Link>
  ]

  return (
    <VespTable<VespUserRole> url="admin/user-roles" initialData={initialData}>
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserRolesTable />
    </VespTable>
  )
}

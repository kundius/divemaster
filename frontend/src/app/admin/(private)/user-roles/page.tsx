import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { UserRolesTable } from '@/components/admin/UserRolesTable'
import { VespTable } from '@/components/admin/VespTable'
import { parseParams } from '@/components/admin/VespTable/utils'
import { Button } from '@/components/ui/button'
import { PageProps, VespUserRole } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { many } from './actions'

export const metadata: Metadata = {
  title: 'Роли пользователей'
}

export default async function Page(props: PageProps) {
  const initialData = await many(parseParams(props.searchParams))

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/user-roles/create" key="create">
      <Button>Добавить роль</Button>
    </Link>
  ]

  return (
    <VespTable<VespUserRole> action={many} initialData={initialData}>
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserRolesTable />
    </VespTable>
  )
}

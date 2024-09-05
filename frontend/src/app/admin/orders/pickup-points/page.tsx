import { PageLayout } from '@/components/admin/PageLayout'
import { UserRolesPage } from '@/components/admin/UserRolesPage'
import { DEFAULT_LIMIT } from '@/lib/ApiTable/constants'
import { ApiTableData } from '@/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, UserRoleEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пункты выдачи'
}

export default async function Page(props: PageProps) {
  // const initialData = await apiGet<ApiTableData<UserRoleEntity>>(
  //   'roles',
  //   {
  //     limit: DEFAULT_LIMIT,
  //     ...props.searchParams
  //   },
  //   withServerAuth()
  // )

  // return <UserRolesPage initialData={initialData} />
  return <PageLayout title="Пункты выдачи">Пункты выдачи</PageLayout>
}

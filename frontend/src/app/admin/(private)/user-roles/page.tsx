import { UserRolesPage } from '@/components/admin/UserRolesPage'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, VespUserRole } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Доступы'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespUserRole>>(
    'roles',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return <UserRolesPage initialData={initialData} />
}

import { UsersPage } from '@/components/admin/UsersPage'
import { DEFAULT_LIMIT } from '@/components/vesp/VespTable/constants'
import { VespTableData } from '@/components/vesp/VespTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, VespUser } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пользователи'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<VespTableData<VespUser>>(
    'users',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return <UsersPage initialData={initialData} />
}

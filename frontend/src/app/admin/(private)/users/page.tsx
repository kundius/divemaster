import { UsersPage } from '@/components/admin/UsersPage'
import { DEFAULT_LIMIT } from '@/components/lib/ApiTable/constants'
import { ApiTableData } from '@/components/lib/ApiTable/types'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, UserEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Пользователи'
}

export default async function Page(props: PageProps) {
  const initialData = await apiGet<ApiTableData<UserEntity>>(
    'users',
    {
      limit: DEFAULT_LIMIT,
      ...props.searchParams
    },
    withServerAuth()
  )

  return <UsersPage initialData={initialData} />
}

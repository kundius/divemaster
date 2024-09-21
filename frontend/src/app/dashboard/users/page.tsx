import type { Metadata } from 'next'
import Link from 'next/link'

import { PageLayout } from '@/components/admin/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { FindAllResult, PageProps, UserEntity } from '@/types'

import { UsersList } from './_components/UsersList'

export const metadata: Metadata = {
  title: 'Пользователи'
}

export default async function Page(props: PageProps) {
  const fallbackData = await apiGet<FindAllResult<UserEntity>>(
    'users',
    props.searchParams,
    withServerAuth()
  )

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/users/create">Добавить пользователя</Link>
    </Button>
  ]

  return (
    <PageLayout title="Пользователи" actions={actions}>
      <UsersList fallbackData={fallbackData} />
    </PageLayout>
  )
}

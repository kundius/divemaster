import type { Metadata } from 'next'
import Link from 'next/link'
import { PageLayout } from '@/app/dashboard/_components/PageLayout'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PageProps, UserRoleEntity } from '@/types'

import { UserRolesList } from './_components/UserRolesList'

export const metadata: Metadata = {
  title: 'Доступы'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<UserRoleEntity>>('roles', await searchParams)

  const actions = [
    <Button asChild key="create">
      <Link href="/dashboard/user-roles/create">Добавить доступ</Link>
    </Button>
  ]

  return (
    <PageLayout title="Доступы" actions={actions}>
      <UserRolesList fallbackData={fallbackData} />
    </PageLayout>
  )
}

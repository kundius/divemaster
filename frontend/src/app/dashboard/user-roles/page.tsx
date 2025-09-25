import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PageProps, UserRoleEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { UserRolesList } from './_components/UserRolesList'

export const metadata: Metadata = {
  title: 'Доступы'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<UserRoleEntity>>('roles', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Доступы</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/user-roles/create">Добавить доступ</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <UserRolesList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}

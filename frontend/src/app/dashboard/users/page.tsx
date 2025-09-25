import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { FindAllResult, PageProps, UserEntity } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AppPage,
  AppPageActions,
  AppPageContent,
  AppPageHeader,
  AppPageTitle
} from '../_components/AppPage'
import { UsersList } from './_components/UsersList'

export const metadata: Metadata = {
  title: 'Пользователи'
}

export default async function Page({ searchParams }: PageProps) {
  const fallbackData = await apiGet<FindAllResult<UserEntity>>('users', await searchParams)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Пользователи</AppPageTitle>
        <AppPageActions>
          <Button asChild>
            <Link href="/dashboard/users/create">Добавить пользователя</Link>
          </Button>
        </AppPageActions>
      </AppPageHeader>
      <AppPageContent>
        <UsersList fallbackData={fallbackData} />
      </AppPageContent>
    </AppPage>
  )
}

import { apiGet } from '@/lib/api'
import { PageProps, UserEntity } from '@/types'
import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { UserUpdate } from '../_components/UserUpdate'

export const metadata: Metadata = {
  title: 'Редактировать пользователя'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<UserEntity>(`users/${id}`)

  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать пользователя</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <UserUpdate record={record} />
      </AppPageContent>
    </AppPage>
  )
}

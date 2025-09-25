import { apiGet } from '@/lib/api'
import { PageProps, UserRoleEntity } from '@/types'
import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { UserRoleUpdate } from '../_components/UserRoleUpdate'

export const metadata: Metadata = {
  title: 'Редактировать доступ'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<UserRoleEntity>(`roles/${id}`)
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать доступ</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <UserRoleUpdate record={record} />
      </AppPageContent>
    </AppPage>
  )
}

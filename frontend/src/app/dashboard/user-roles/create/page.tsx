import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { UserRoleCreate } from '../_components/UserRoleCreate'

export const metadata: Metadata = {
  title: 'Добавить доступ'
}

export default async function Page() {
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить доступ</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <UserRoleCreate />
      </AppPageContent>
    </AppPage>
  )
}

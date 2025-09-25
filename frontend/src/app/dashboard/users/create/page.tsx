import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { UserCreate } from '../_components/UserCreate'

export const metadata: Metadata = {
  title: 'Добавить пользователя'
}

export default async function Page() {
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить пользователя</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <UserCreate />
      </AppPageContent>
    </AppPage>
  )
}

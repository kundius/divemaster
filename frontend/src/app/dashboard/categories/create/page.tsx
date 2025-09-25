import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { CategoriesCreate } from '../_components/CategoriesCreate'

export const metadata: Metadata = {
  title: 'Добавить категорию'
}

export default function Page() {
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить категорию</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <CategoriesCreate />
      </AppPageContent>
    </AppPage>
  )
}

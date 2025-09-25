import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { BrandCreate } from '../_components/BrandCreate'

export const metadata: Metadata = {
  title: 'Добавить бренд'
}

export default async function Page() {
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить бренд</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <BrandCreate />
      </AppPageContent>
    </AppPage>
  )
}

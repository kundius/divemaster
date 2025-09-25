import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from './_components/AppPage'

export const metadata: Metadata = {
  title: 'Панель управления'
}

export default function Page() {
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Панель управления</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>Место под графики, статистику и пр.</AppPageContent>
    </AppPage>
  )
}

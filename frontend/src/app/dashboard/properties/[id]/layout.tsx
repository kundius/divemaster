import { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { SubNav } from '../../_components/SubNav'

export const metadata: Metadata = {
  title: 'Редактировать характеристику'
}

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const nav = [
    {
      title: 'Свойства',
      url: `/dashboard/properties/${id}`
    },
    {
      title: 'Категории',
      url: `/dashboard/properties/${id}/categories`
    }
  ]
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать характеристику</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <SubNav items={nav} />
        {children}
      </AppPageContent>
    </AppPage>
  )
}

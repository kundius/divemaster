import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { SubNav } from '../../_components/SubNav'

export const metadata: Metadata = {
  title: 'Редактировать пост'
}

export default async function Page({
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
      url: `/dashboard/blog/${id}`
    },
    {
      title: 'Метаданные',
      url: `/dashboard/blog/${id}/metadata`
    }
  ]
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать пост</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <SubNav items={nav} />
        {children}
      </AppPageContent>
    </AppPage>
  )
}

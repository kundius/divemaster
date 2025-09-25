import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'
import { SubNav } from '../../_components/SubNav'
import { BlogPostCreate } from '../_components/BlogPostCreate'

export const metadata: Metadata = {
  title: 'Добавить пост'
}

export default async function Page() {
  const nav = [
    {
      title: 'Документ',
      url: `/dashboard/blog/create`
    },
    {
      title: 'Метаданные',
      url: '#',
      disabled: true
    }
  ]
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Добавить пост</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <SubNav items={nav} />
        <BlogPostCreate />
      </AppPageContent>
    </AppPage>
  )
}

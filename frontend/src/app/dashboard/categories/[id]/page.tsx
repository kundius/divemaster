import { CategoriesUpdate } from '@/app/dashboard/categories/_components/CategoriesUpdate'
import { apiGet } from '@/lib/api'
import { CategoryEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import { AppPage, AppPageContent, AppPageHeader, AppPageTitle } from '../../_components/AppPage'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<CategoryEntity>(`categories/${id}`, { allowInactive: true })
  return (
    <AppPage>
      <AppPageHeader>
        <AppPageTitle>Редактировать категорию</AppPageTitle>
      </AppPageHeader>
      <AppPageContent>
        <CategoriesUpdate record={record} />
      </AppPageContent>
    </AppPage>
  )
}

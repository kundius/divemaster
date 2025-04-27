import { CategoriesUpdate } from '@/app/dashboard/categories/_components/CategoriesUpdate'
import { CategoryEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import { PageLayout } from '../../_components/PageLayout'
import { apiGet } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<CategoryEntity>(`categories/${id}`, { allowInactive: true })
  return (
    <PageLayout title="Редактировать категорию">
      <CategoriesUpdate initialData={initialData} />
    </PageLayout>
  )
}

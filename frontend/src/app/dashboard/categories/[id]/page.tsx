import { CategoriesEditPage } from '@/components/admin/CategoriesEditPage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { CategoryEntity, PageProps } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<CategoryEntity>(
    `categories/${id}`,
    {
      withContent: true,
      withParent: true
    },
    withServerAuth()
  )
  return <CategoriesEditPage initialData={initialData} />
}

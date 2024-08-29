import { CategoriesEditPage } from '@/components/admin/CategoriesEditPage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { CategoryEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<CategoryEntity>(
    `categories/${params.id}`,
    {
      withContent: true,
      withParent: true
    },
    withServerAuth()
  )
  return <CategoriesEditPage initialData={initialData} />
}

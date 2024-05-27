import { CategoriesEditPage } from '@/components/admin/CategoriesEditPage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { Category } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<Category>(
    `categories/${params.id}?relations=parent,children,test`,
    {},
    withServerAuth()
  )
  return <CategoriesEditPage initialData={initialData} />
}

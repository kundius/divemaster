import { CategoriesEditPage } from '@/components/admin/CategoriesEditPage'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespCategory } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespCategory>(`admin/categories/${params.id}`, {}, withAuth())
  return <CategoriesEditPage initialData={initialData} />
}

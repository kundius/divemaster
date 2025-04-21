import { CategoriesUpdate } from '@/app/dashboard/categories/_components/CategoriesUpdate'
import { CategoryEntity, PageProps } from '@/types'
import type { Metadata } from 'next'
import { PageLayout } from '../../_components/PageLayout'
import { apiGet } from '@/lib/api'
import { revalidatePath } from 'next/cache'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<CategoryEntity>(`categories/${id}`, {
    withContent: true,
    withParent: true
  })
  async function revalidateCategory(alias: string) {
    'use server'
    revalidatePath(`/category/${alias}`, 'page')
  }
  return (
    <PageLayout title="Редактировать категорию">
      <CategoriesUpdate initialData={initialData} revalidateCategory={revalidateCategory} />
    </PageLayout>
  )
}

import { BrandsUpdatePage } from '@/components/admin/BrandsUpdatePage'
import { apiGet } from '@/lib/api'
import { BrandEntity, PageProps } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать бренд'
}

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<BrandEntity>(`brands/${id}`)
  return <BrandsUpdatePage initialData={initialData} />
}

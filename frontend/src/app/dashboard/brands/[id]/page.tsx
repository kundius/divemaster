import { BrandsUpdatePage } from '@/components/admin/BrandsUpdatePage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { BrandEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать бренд'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<BrandEntity>(`brands/${params.id}`, {}, withServerAuth())
  return <BrandsUpdatePage initialData={initialData} />
}

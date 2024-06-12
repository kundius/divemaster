import { PageLayout } from '@/components/admin/PageLayout'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать параметр'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<OptionEntity>(`options/${params.id}`, {}, withServerAuth())
  return <div>Категории</div>
}

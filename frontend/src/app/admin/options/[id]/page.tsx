import { PageLayout } from '@/components/admin/PageLayout'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity } from '@/types'
import type { Metadata } from 'next'
import { OptionUpdateForm } from '../_components/OptionUpdateForm'

export const metadata: Metadata = {
  title: 'Редактировать параметр'
}

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<OptionEntity>(`options/${params.id}`, {}, withServerAuth())
  return (
    <PageLayout title="Редактировать параметр">
      <OptionUpdateForm initialData={initialData} />
    </PageLayout>
  )
}

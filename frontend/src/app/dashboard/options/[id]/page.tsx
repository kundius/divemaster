import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity, PageProps } from '@/types'
import { OptionUpdateForm } from '../_components/OptionUpdateForm'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<OptionEntity>(`options/${id}`, {}, await withServerAuth())
  return <OptionUpdateForm initialData={initialData} />
}

import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity } from '@/types'
import { OptionUpdateForm } from '../_components/OptionUpdateForm'

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<OptionEntity>(`options/${params.id}`, {}, withServerAuth())
  return <OptionUpdateForm initialData={initialData} />
}

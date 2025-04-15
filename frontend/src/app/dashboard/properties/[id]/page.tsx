import { apiGet } from '@/lib/api'
import { PropertyEntity, PageProps } from '@/types'
import { PropertyUpdateForm } from '../_components/PropertyUpdateForm'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<PropertyEntity>(`properties/${id}`)
  return <PropertyUpdateForm initialData={initialData} />
}

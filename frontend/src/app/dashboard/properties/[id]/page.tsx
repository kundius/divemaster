import { apiGet } from '@/lib/api'
import { PageProps, PropertyEntity } from '@/types'
import { PropertyUpdateForm } from '../_components/PropertyUpdateForm'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<PropertyEntity>(`properties/${id}`)
  return <PropertyUpdateForm record={record} />
}

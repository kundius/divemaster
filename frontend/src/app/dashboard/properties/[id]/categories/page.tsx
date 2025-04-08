import { PageProps } from '@/types'
import { PropertyCategories } from '../../_components/PropertyCategories'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  return <PropertyCategories propertyId={id} />
}

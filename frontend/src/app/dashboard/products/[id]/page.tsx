import { apiGet } from '@/lib/api'
import { PageProps, ProductEntity } from '@/types'
import { ProductUpdate } from '../_components/ProductUpdate'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const record = await apiGet<ProductEntity>(`products/${id}`, { allowInactive: true })

  return <ProductUpdate record={record} />
}

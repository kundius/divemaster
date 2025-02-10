import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { PageProps, ProductEntity } from '@/types'
import { ProductUpdate } from '../_components/ProductUpdate'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<ProductEntity>(`products/${id}`, {}, await withServerAuth())

  return <ProductUpdate initialData={initialData} />
}

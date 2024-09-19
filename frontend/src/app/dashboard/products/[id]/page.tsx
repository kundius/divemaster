import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { ProductEntity } from '@/types'
import { ProductUpdate } from '../_components/ProductUpdate'

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<ProductEntity>(`products/${params.id}`, {}, withServerAuth())

  return <ProductUpdate initialData={initialData} />
}

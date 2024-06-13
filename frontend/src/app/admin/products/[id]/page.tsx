import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { ProductEntity } from '@/types'
import { ProductUpdateForm } from '../_components/ProductUpdateForm'

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<ProductEntity>(`products/${params.id}`, {}, withServerAuth())

  return <ProductUpdateForm initialData={initialData} />
}

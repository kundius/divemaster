import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { ProductEntity } from '@/types'
import { ProductDescription } from '../../_components/ProductDescription'

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<ProductEntity>(
    `products/${params.id}`,
    { withContent: true },
    withServerAuth()
  )

  return <ProductDescription initialData={initialData} />
}

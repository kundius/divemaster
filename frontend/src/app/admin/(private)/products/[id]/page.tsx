import { ProductsUpdatePage } from '@/components/admin/ProductsUpdatePage'
import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { VespProduct } from '@/types'

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespProduct>(`products/${params.id}`, {}, withServerAuth())

  return <ProductsUpdatePage initialData={initialData} />
}

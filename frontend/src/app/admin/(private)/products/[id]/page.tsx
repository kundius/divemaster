import { ProductsUpdatePage } from '@/components/admin/ProductsUpdatePage'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespProduct } from '@/types'

export default async function Page({ params }: { params: { id: number } }) {
  const initialData = await apiGet<VespProduct>(`admin/products/${params.id}`, {}, withAuth())

  return <ProductsUpdatePage initialData={initialData} />
}

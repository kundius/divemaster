import { apiGet } from '@/lib/api'
import { PageProps, ProductEntity } from '@/types'
import { ProductDescription } from '../../_components/ProductDescription'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const initialData = await apiGet<ProductEntity>(`products/${id}`, { withContent: true })

  return <ProductDescription initialData={initialData} />
}

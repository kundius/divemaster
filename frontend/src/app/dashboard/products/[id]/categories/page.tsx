import { PageProps } from '@/types'
import { ProductCategories } from '../../_components/ProductCategories'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  return <ProductCategories productId={id} />
}

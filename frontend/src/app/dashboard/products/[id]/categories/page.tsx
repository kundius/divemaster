import { ProductCategories } from '../../_components/ProductCategories'

export default async function Page({ params }: { params: { id: number } }) {
  return <ProductCategories productId={params.id} />
}

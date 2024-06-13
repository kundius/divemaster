import { ProductOptions } from '../../_components/ProductOptions'

export default async function Page({ params }: { params: { id: number } }) {
  return <ProductOptions productId={params.id} />
}

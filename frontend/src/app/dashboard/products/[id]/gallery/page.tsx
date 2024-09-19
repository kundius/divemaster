import { ProductGallery } from '../../_components/ProductGallery'

export default async function Page({ params }: { params: { id: number } }) {
  return <ProductGallery productId={params.id} />
}

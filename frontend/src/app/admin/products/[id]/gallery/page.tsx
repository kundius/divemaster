import { ProductGallery } from '@/components/admin/ProductGallery'

export default async function Page({ params }: { params: { id: number } }) {
  return <ProductGallery productId={params.id} />
}

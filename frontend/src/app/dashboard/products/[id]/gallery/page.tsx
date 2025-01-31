import { PageProps } from '@/types'
import { ProductGallery } from '../../_components/ProductGallery'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  return <ProductGallery productId={id} />
}

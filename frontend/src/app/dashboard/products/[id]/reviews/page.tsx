import { PageProps } from '@/types'
import { ProductReviews } from '../../_components/ProductReviews'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  return <ProductReviews productId={id} />
}

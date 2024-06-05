import { ProductContent } from '@/components/admin/ProductContent'

export default async function Page({ params }: { params: { id: number } }) {
  return <ProductContent productId={params.id} />
}

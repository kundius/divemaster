import { ProductCategories } from '@/components/admin/ProductCategories'

export default async function Page({ params }: { params: { id: number } }) {
  return <ProductCategories productId={params.id} />
}

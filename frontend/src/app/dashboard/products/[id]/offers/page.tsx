import { apiGet } from '@/lib/api'
import { PageProps, ProductEntity } from '@/types'
import { ProductOffers, ProductOffersProps } from '../../_components/ProductOffers'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const product = await apiGet<ProductEntity>(`products/${id}`, { withOptions: true })

  const properties: ProductOffersProps['properties'] = {}
  for (const property of product.properties || []) {
    const options = (product.options || [])
      .filter((option) => option.name == property.key)
      .map((option) => option.content)
    properties[property.key] = { property, options }
  }

  return <ProductOffers productId={product.id} properties={properties} />
}

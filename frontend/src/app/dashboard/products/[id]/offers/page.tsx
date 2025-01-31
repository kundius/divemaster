import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionType, PageProps, ProductEntity } from '@/types'
import { ProductOffers } from '../../_components/ProductOffers'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const product = await apiGet<ProductEntity>(
    `products/${id}`,
    { withOptions: true },
    withServerAuth()
  )

  const comboOptions = (product.options || []).filter((option) =>
    [OptionType.COMBOCOLORS, OptionType.COMBOOPTIONS].includes(option.type)
  )

  for (const option of comboOptions) {
    option.values = (product.optionValues || []).filter((ov) => ov.optionId === option.id)
  }

  return <ProductOffers productId={id} options={comboOptions} />
}

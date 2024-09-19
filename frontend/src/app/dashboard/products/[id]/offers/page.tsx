import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OfferEntity, OptionEntity, OptionType, ProductEntity } from '@/types'
import { ProductOffers } from '../../_components/ProductOffers'
import { getEntityId } from '@/lib/utils'

export default async function Page({ params }: { params: { id: number } }) {
  const product = await apiGet<ProductEntity>(
    `products/${params.id}`,
    { withOptions: true },
    withServerAuth()
  )

  const comboOptions = (product.options || []).filter((option) =>
    [OptionType.COMBOCOLORS, OptionType.COMBOOPTIONS].includes(option.type)
  )

  for (const option of comboOptions) {
    option.values = (product.optionValues || []).filter(
      (ov) => getEntityId(ov.option) === option.id
    )
  }

  return <ProductOffers productId={params.id} options={comboOptions} />
}

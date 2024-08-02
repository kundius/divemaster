import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OfferEntity, OptionEntity, OptionType } from '@/types'
import { ProductOffers } from '../../_components/ProductOffers'

export default async function Page({ params }: { params: { id: number } }) {
  const options = await apiGet<OptionEntity[]>(
    `products/${params.id}/options`,
    {},
    withServerAuth()
  )

  const comboOptions = options.filter((option) =>
    [OptionType.COMBOCOLORS, OptionType.COMBOOPTIONS].includes(option.type)
  )

  return <ProductOffers productId={params.id} options={comboOptions} />
}

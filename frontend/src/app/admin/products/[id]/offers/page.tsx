import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OfferEntity } from '@/types'
import { ProductOffers } from '../../_components/ProductOffers'

export default async function Page({ params }: { params: { id: number } }) {
  const [offers] = await Promise.all([
    apiGet<OfferEntity[]>(`products/${params.id}/offers`, {}, withServerAuth())
  ])

  return <ProductOffers productId={params.id} initialOffers={offers} />
}

import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity } from '@/types'
import { ProductOptions, ValuesType } from '../../_components/ProductOptions'

export default async function Page({ params }: { params: { id: number } }) {
  const [options, values] = await Promise.all([
    apiGet<OptionEntity[]>(`products/${params.id}/options`, {}, withServerAuth()),
    apiGet<ValuesType>(`products/${params.id}/option-values`, {}, withServerAuth())
  ])

  return <ProductOptions productId={params.id} initialOptions={options} initialValues={values} />
}

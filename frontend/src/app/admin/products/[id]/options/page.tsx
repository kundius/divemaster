import { apiGet } from '@/lib/api'
import { withServerAuth } from '@/lib/api/with-server-auth'
import { OptionEntity, OptionType } from '@/types'
import { ProductOptions, ValuesType } from '../../_components/ProductOptions'

export default async function Page({ params }: { params: { id: number } }) {
  const [options] = await Promise.all([
    apiGet<OptionEntity[]>(`products/${params.id}/options`, {}, withServerAuth())
  ])

  const initialValues: ValuesType = {}
  for (const option of options) {
    if (!option.values || option.values.length === 0) continue

    switch (option.type) {
      case OptionType.TEXTFIELD:
        initialValues[option.key] = option.values[0].content
        break
      case OptionType.COMBOBOOLEAN:
        initialValues[option.key] = option.values[0].content === '1'
        break
      case OptionType.NUMBERFIELD:
        initialValues[option.key] = Number(option.values[0].content)
        break
      case OptionType.COMBOCOLORS:
      case OptionType.COMBOOPTIONS:
        initialValues[option.key] = option.values.map((optionValue) => optionValue.content)
        break
    }
  }

  return (
    <ProductOptions productId={params.id} initialOptions={options} initialValues={initialValues} />
  )
}

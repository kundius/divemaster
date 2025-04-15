import { apiGet } from '@/lib/api'
import { PropertyType, PageProps, ProductEntity } from '@/types'
import { ProductOptions, OptionsType } from '../../_components/ProductOptions'

export default async function Page({ params }: PageProps<{ id: number }>) {
  const { id } = await params
  const [product] = await Promise.all([
    apiGet<ProductEntity>(`products/${id}`, { withOptions: true })
  ])

  const initialOptions: OptionsType = {}
  for (const property of product.properties || []) {
    const options = (product.options || [])
      .filter((a) => a.name === property.key)
      .map((a) => a.content)

    switch (property.type) {
      case PropertyType.TEXTFIELD:
        initialOptions[property.key] = options[0]
        break
      case PropertyType.COMBOBOOLEAN:
        initialOptions[property.key] = options[0] === '1'
        break
      case PropertyType.NUMBERFIELD:
        initialOptions[property.key] = Number(options[0])
        break
      case PropertyType.COMBOCOLORS:
      case PropertyType.COMBOOPTIONS:
        initialOptions[property.key] = options
        break
    }
  }

  return (
    <ProductOptions
      productId={id}
      properties={product.properties || []}
      initialOptions={initialOptions}
    />
  )
}

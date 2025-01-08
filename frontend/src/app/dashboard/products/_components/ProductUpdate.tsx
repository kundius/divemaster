'use client'

import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { ProductForm, ProductFormFields, ProductFormSchema } from './ProductForm'

export interface ProductUpdateProps {
  initialData: ProductEntity
}

export function ProductUpdate({ initialData }: ProductUpdateProps) {
  const [form, onSubmit] = useApiForm<ProductFormFields>({
    url: `products/${initialData.id}`,
    method: 'PATCH',
    schema: ProductFormSchema,
    defaultValues: {
      title: initialData.title,
      alias: initialData.alias,
      priceDecrease: initialData.priceDecrease,
      longTitle: initialData.longTitle,
      sku: initialData.sku,
      rank: initialData.rank,
      brandId: initialData.brandId || null,
      active: initialData.active,
      recent: initialData.recent,
      favorite: initialData.favorite,
      inStock: initialData.inStock
    },
    mapValues: (values) => {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    }
  })
  return <ProductForm form={form} onSubmit={onSubmit} />
}

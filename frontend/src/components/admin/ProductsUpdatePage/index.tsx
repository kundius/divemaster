'use client'

import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { ProductForm, ProductFormFields, ProductFormSchema } from '../ProductForm'

export interface ProductsUpdatePageProps {
  initialData: ProductEntity
}

export function ProductsUpdatePage({ initialData }: ProductsUpdatePageProps) {
  console.log(initialData)
  const [form, onSubmit] = useApiForm<ProductFormFields>({
    url: `products/${initialData.id}`,
    method: 'PATCH',
    schema: ProductFormSchema,
    defaultValues: {
      title: initialData.title,
      alias: initialData.alias,
      price: initialData.price,
      oldPrice: initialData.oldPrice,
      longTitle: initialData.longTitle,
      description: initialData.description,
      sku: initialData.sku,
      brandId:
        typeof initialData.brand === 'number' ? initialData.brand : initialData.brand?.id || null,
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

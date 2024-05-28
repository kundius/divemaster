'use client'

import { useApiForm } from '@/components/lib/ApiForm'
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
      active: initialData.active,
      description: initialData.description || '',
      title: initialData.title,
      alias: initialData.alias,
      price: initialData.price,
      sku: initialData.sku || ''
    },
    mapValues: (values) => {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    }
  })
  return <ProductForm form={form} onSubmit={onSubmit} />
}

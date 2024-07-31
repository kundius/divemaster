'use client'

import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { ProductForm, ProductFormFields, ProductFormSchema } from './ProductForm'

export function ProductCreate() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<ProductFormFields, ProductEntity>({
    url: `products`,
    method: 'POST',
    schema: ProductFormSchema,
    defaultValues: {
      title: '',
      alias: '',
      priceDecrease: null,
      longTitle: null,
      sku: null,
      brandId: null,
      active: true,
      recent: false,
      favorite: false,
      inStock: false
    },
    mapValues: (values) => {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    },
    onSuccess: (data) => {
      router.push(`/admin/products/${data.id}`)
    }
  })
  return <ProductForm form={form} onSubmit={onSubmit} />
}

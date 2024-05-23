'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { slugify } from '@/lib/utils'
import { VespProduct } from '@/types'
import { useRouter } from 'next/navigation'
import { ProductForm, ProductFormFields, ProductFormSchema } from '../ProductForm'

export function ProductsCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<ProductFormFields, VespProduct>({
    url: `products`,
    method: 'POST',
    schema: ProductFormSchema,
    defaultValues: {
      active: true,
      description: '',
      title: '',
      alias: '',
      sku: ''
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

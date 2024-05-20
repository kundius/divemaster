'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { VespProduct } from '@/types'
import { useRouter } from 'next/navigation'
import { ProductForm, ProductFormFields, ProductFormSchema } from '../ProductForm'

export function ProductsCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<ProductFormFields, VespProduct>({
    url: `admin/products`,
    method: 'PUT',
    schema: ProductFormSchema,
    defaultValues: {
      active: true,
      description: '',
      title: '',
      sku: ''
    },
    onSuccess: (data) => {
      router.push(`/admin/products/${data.id}`)
    }
  })
  return <ProductForm form={form} onSubmit={onSubmit} />
}

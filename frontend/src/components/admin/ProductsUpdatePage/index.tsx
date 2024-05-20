'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { VespProduct } from '@/types'
import { useRouter } from 'next/navigation'
import { ProductForm, ProductFormFields, ProductFormSchema } from '../ProductForm'

export interface ProductsUpdatePageProps {
  initialData: VespProduct
}

export function ProductsUpdatePage({ initialData }: ProductsUpdatePageProps) {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<ProductFormFields, VespProduct>({
    url: `admin/products/${initialData.id}`,
    method: 'PATCH',
    schema: ProductFormSchema,
    defaultValues: {
      active: initialData.active,
      description: initialData.description || '',
      title: initialData.title,
      category_id: initialData.category_id,
      price: initialData.price,
      sku: initialData.sku
    },
    onSuccess: (data) => {
      router.push(`/admin/products/${data.id}`)
    }
  })
  return <ProductForm form={form} onSubmit={onSubmit} />
}

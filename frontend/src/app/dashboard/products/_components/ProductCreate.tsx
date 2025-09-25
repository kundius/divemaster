'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ProductForm, ProductFormFields, ProductFormSchema } from './ProductForm'

export function ProductCreate() {
  const router = useRouter()

  const form = useForm<ProductFormFields>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: '',
      alias: '',
      priceDecrease: null,
      longTitle: null,
      sku: null,
      rank: null,
      brandId: null,
      active: true,
      recent: false,
      favorite: false,
      inStock: false
    }
  })

  const onSubmit = async (values: ProductFormFields) => {
    values.alias = slugify(values.alias || values.title)
    form.setValue('alias', values.alias)

    try {
      const result = await apiPost<ProductEntity>(`products`, values)
      toast.success('Товар добавлен')
      router.push(`/dashboard/products/${result.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <ProductForm />
      </form>
    </Form>
  )
}

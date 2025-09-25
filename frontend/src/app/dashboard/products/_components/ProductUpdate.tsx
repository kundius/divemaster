'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ProductForm, ProductFormFields, ProductFormSchema } from './ProductForm'

export interface ProductUpdateProps {
  record: ProductEntity
}

export function ProductUpdate({ record }: ProductUpdateProps) {
  const form = useForm<ProductFormFields>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: record.title,
      alias: record.alias,
      priceDecrease: record.priceDecrease,
      longTitle: record.longTitle,
      sku: record.sku,
      rank: record.rank,
      brandId: record.brandId || null,
      active: record.active,
      recent: record.recent,
      favorite: record.favorite,
      inStock: record.inStock
    }
  })

  const onSubmit = async (values: ProductFormFields) => {
    values.alias = slugify(values.alias || values.title)
    form.setValue('alias', values.alias)

    try {
      await apiPatch(`products/${record.id}`, values)
      toast.success('Товар изменен')
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

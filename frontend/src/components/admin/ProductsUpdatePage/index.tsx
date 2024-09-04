'use client'

import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { PageLayout } from '../PageLayout'
import { ProductForm, ProductFormFields, ProductFormSchema } from '../ProductForm'
import { ProductLayout } from '../ProductLayout'
import { revalidatePath } from 'next/cache'

export interface ProductsUpdatePageProps {
  initialData: ProductEntity
}

export function ProductsUpdatePage({ initialData }: ProductsUpdatePageProps) {
  const [form, onSubmit] = useApiForm<ProductFormFields, ProductEntity>({
    url: `products/${initialData.id}`,
    method: 'PATCH',
    schema: ProductFormSchema,
    defaultValues: {
      title: initialData.title,
      alias: initialData.alias,
      priceDecrease: initialData.priceDecrease,
      longTitle: initialData.longTitle,
      description: initialData.description,
      specifications: initialData.specifications,
      exploitation: initialData.exploitation,
      sku: initialData.sku,
      brandId:
        typeof initialData.brand === 'number' ? initialData.brand : initialData.brand?.id || null,
      active: initialData.active,
      recent: initialData.recent,
      favorite: initialData.favorite,
      inStock: initialData.inStock
    },
    mapValues(values) {
      values.alias = slugify(values.alias || values.title)
      form.setValue('alias', values.alias)
      return values
    }
  })
  return (
    <PageLayout
      title="Свойства товара"
      actions={
        <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
          {form.formState.isSubmitting && <ButtonLoadingIcon />}
          Сохранить
        </Button>
      }
    >
      <ProductLayout productId={initialData.id}>
        <ProductForm form={form} onSubmit={onSubmit} />
      </ProductLayout>
    </PageLayout>
  )
}

'use client'

import { useApiForm } from '@/lib/ApiForm'
import { slugify } from '@/lib/utils'
import { ProductEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { ProductForm, ProductFormFields, ProductFormSchema } from '../ProductForm'
import { PageLayout } from '../../../app/dashboard/_components/PageLayout'
import { ProductLayout } from '../ProductLayout'
import { Button, ButtonLoadingIcon } from '@/components/ui/button'

export function ProductsCreatePage() {
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
      description: null,
      specifications: null,
      exploitation: null,
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
  return (
    <PageLayout
      title="Добавить товар"
      actions={
        <Button disabled={form.formState.isSubmitting} onClick={form.handleSubmit(onSubmit)}>
          {form.formState.isSubmitting && <ButtonLoadingIcon />}
          Сохранить
        </Button>
      }
    >
      <ProductLayout>
        <ProductForm form={form} onSubmit={onSubmit} />
      </ProductLayout>
    </PageLayout>
  )
}

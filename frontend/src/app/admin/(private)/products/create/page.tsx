import { PageHeader } from '@/components/admin/PageHeader'
import { ProductForm, ProductFormFields, ProductFormSchema } from '@/components/admin/ProductForm'
import { ProductLayout } from '@/components/admin/ProductLayout'
import { VespForm } from '@/components/vesp/VespForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить товар'
}

export default function Page() {
  const nav = [
    {
      title: 'Основные',
      href: `/admin/products/create`
    },
    {
      title: 'Галерея'
    },
    {
      title: 'Параметры'
    }
  ]
  return (
    <div>
      <PageHeader title={`${metadata.title}`} />
      <ProductLayout nav={nav}>
        <VespForm<ProductFormFields>
          url="admin/products"
          method="PUT"
          schema={ProductFormSchema}
          defaultValues={{
            active: true,
            description: '',
            title: '',
            sku: ''
          }}
        >
          <ProductForm />
        </VespForm>
      </ProductLayout>
    </div>
  )
}

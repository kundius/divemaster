import { ProductForm, ProductFormFields, ProductFormSchema } from '@/components/admin/ProductForm'
import { VespForm } from '@/components/vesp/VespForm'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespProduct } from '@/types'

export default async function Page({ params }: { params: { id: number } }) {
  const data = await apiGet<VespProduct>(`admin/products/${params.id}`, {}, withAuth())

  return (
    <VespForm<ProductFormFields>
      url={`admin/products/${params.id}`}
      method="PATCH"
      schema={ProductFormSchema}
      defaultValues={{
        active: data.active,
        description: data.description || '',
        title: data.title,
        category_id: data.category_id,
        price: data.price,
        sku: data.sku
      }}
    >
      <ProductForm />
    </VespForm>
  )
}

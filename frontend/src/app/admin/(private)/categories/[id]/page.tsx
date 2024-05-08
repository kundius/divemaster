import {
  CategoryForm,
  CategoryFormFields,
  CategoryFormSchema
} from '@/components/admin/CategoryForm'
import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { VespForm } from '@/components/vesp/VespForm'
import { VespFormCancel } from '@/components/vesp/VespFormCancel'
import { VespFormSubmit } from '@/components/vesp/VespFormSubmit'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespCategory } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать категорию'
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await apiGet<VespCategory>(`admin/categories/${params.id}`, {}, withAuth())

  const actions: PageHeaderProps['actions'] = [
    <VespFormCancel key="back" />,
    <VespFormSubmit key="submit" />
  ]

  return (
    <VespForm<CategoryFormFields>
      url={`admin/categories/${params.id}`}
      method="PATCH"
      schema={CategoryFormSchema}
      defaultValues={{
        active: data.active,
        description: data.description || '',
        title: data.title,
        alias: data.alias
      }}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <CategoryForm />
    </VespForm>
  )
}

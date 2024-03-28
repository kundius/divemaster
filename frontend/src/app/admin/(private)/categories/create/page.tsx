import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import {
  CategoryForm,
  CategoryFormFields,
  CategoryFormSchema
} from '@/components/admin/CategoryForm'
import { VespForm } from '@/components/vesp/VespForm'
import { VespFormCancel } from '@/components/vesp/VespFormCancel'
import { VespFormSubmit } from '@/components/vesp/VespFormSubmit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить категорию'
}

export default function Page() {
  const actions: PageHeaderProps['actions'] = [
    <VespFormCancel key="back" />,
    <VespFormSubmit key="submit" />
  ]

  return (
    <VespForm<CategoryFormFields>
      url="admin/categories"
      method="PUT"
      schema={CategoryFormSchema}
      defaultValues={{
        title: '',
        description: '',
        active: true
      }}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <CategoryForm />
    </VespForm>
  )
}

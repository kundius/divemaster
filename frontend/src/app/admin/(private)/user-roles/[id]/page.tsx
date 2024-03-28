import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { VespForm } from '@/components/admin/VespForm'
import { VespFormCancel } from '@/components/admin/VespFormCancel'
import { VespFormSubmit } from '@/components/admin/VespFormSubmit'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespUserRole } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать роль'
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await apiGet<VespUserRole>(`admin/user-roles/${params.id}`, {}, withAuth())

  const actions: PageHeaderProps['actions'] = [
    <VespFormCancel key="back" />,
    <VespFormSubmit key="submit" />
  ]

  return (
    <VespForm<UserRoleFormFields>
      url={`admin/user-roles/${params.id}`}
      method="PATCH"
      schema={UserRoleFormSchema}
      defaultValues={{
        scope: data.scope || [],
        title: data.title
      }}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserRoleForm />
    </VespForm>
  )
}

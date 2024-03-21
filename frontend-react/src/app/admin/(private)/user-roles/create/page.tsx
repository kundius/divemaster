import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { VespForm } from '@/components/admin/VespForm'
import { VespFormCancel } from '@/components/admin/VespFormCancel'
import { VespFormSubmit } from '@/components/admin/VespFormSubmit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить роль'
}

export default function Page() {
  const data = {
    title: '',
    scope: []
  }

  const actions: PageHeaderProps['actions'] = [
    <VespFormCancel key="back" />,
    <VespFormSubmit key="submit" />
  ]

  return (
    <VespForm<UserRoleFormFields>
      url="admin/user-roles"
      method="PUT"
      schema={UserRoleFormSchema}
      defaultValues={data}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserRoleForm />
    </VespForm>
  )
}

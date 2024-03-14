import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { VespForm } from '@/components/admin/VespForm'
import { VespFormSubmit } from '@/components/admin/VespFormSubmit'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Добавить роль'
}

export default function Page() {
  const data = {
    title: '',
    scope: []
  }

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/user-roles" key="back">
      <Button variant="secondary">Отмена</Button>
    </Link>,
    <VespFormSubmit key="submit">Сохранить</VespFormSubmit>
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

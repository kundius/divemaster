import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { VespForm } from '@/components/admin/VespForm'
import { VespFormSubmit } from '@/components/admin/VespFormSubmit'
import { Button } from '@/components/ui/button'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespUserRole } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Изменить роль'
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await apiGet<VespUserRole>(`admin/user-roles/${params.id}`, {}, withAuth())

  const actions: PageHeaderProps['actions'] = [
    <Link href="/admin/user-roles" key="back">
      <Button variant="secondary">Отмена</Button>
    </Link>,
    <VespFormSubmit key="submit">Сохранить</VespFormSubmit>
  ]

  return (
    <VespForm<UserRoleFormFields>
      url="admin/user-roles"
      method="PATCH"
      schema={UserRoleFormSchema}
      defaultValues={data}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserRoleForm />
    </VespForm>
  )
}

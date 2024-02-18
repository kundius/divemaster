import { FormPage } from '@/components/admin/FormPage'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import type { VespUserRole } from '@/types'
import type { Metadata } from 'next'
import { update } from '../actions'

export const metadata: Metadata = {
  title: 'Изменить роль'
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await apiGet<VespUserRole>(`admin/user-roles/${params.id}`, {}, withAuth())

  return (
    <FormPage<UserRoleFormFields>
      action={update}
      title={`${metadata.title}`}
      sectionPath="/admin/user-roles"
      defaultValues={data}
      schema={UserRoleFormSchema}
    >
      <UserRoleForm />
    </FormPage>
  )
}

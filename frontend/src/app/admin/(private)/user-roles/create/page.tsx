import { FormPage } from '@/components/admin/FormPage'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { apiPut } from '@/lib/utils/server'
import { withAuth } from '@/lib/utils/with-auth'
import { VespUserRole } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить роль'
}

export default function Page() {
  async function create(values: UserRoleFormFields) {
    'use server'

    return apiPut<VespUserRole>(
      `admin/user-roles`,
      withAuth({
        body: JSON.stringify(values)
      })
    )
  }

  return (
    <FormPage<UserRoleFormFields>
      action={create}
      title={`${metadata.title}`}
      sectionPath="/admin/user-roles"
      schema={UserRoleFormSchema}
      defaultValues={{
        title: '',
        scope: []
      }}
    >
      <UserRoleForm />
    </FormPage>
  )
}

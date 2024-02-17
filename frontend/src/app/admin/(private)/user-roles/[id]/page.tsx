import { FormPage } from '@/components/admin/FormPage'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import { apiGet, apiPatch } from '@/lib/utils/server'
import { withAuth } from '@/lib/utils/with-auth'
import type { VespUserRole } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Изменить роль'
}

export default async function Page({ params }: { params: { id: number } }) {
  const apiRoute = `admin/user-roles/${params.id}`

  const data = await apiGet<VespUserRole>(apiRoute, withAuth())

  async function update(values: UserRoleFormFields) {
    'use server'

    return apiPatch<VespUserRole>(
      apiRoute,
      withAuth({
        body: JSON.stringify(values)
      })
    )
  }

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

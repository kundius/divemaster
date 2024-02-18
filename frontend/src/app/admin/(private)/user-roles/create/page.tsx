import { FormPage } from '@/components/admin/FormPage'
import {
  UserRoleForm,
  UserRoleFormFields,
  UserRoleFormSchema
} from '@/components/admin/UserRoleForm'
import type { Metadata } from 'next'
import { create } from '../actions'

export const metadata: Metadata = {
  title: 'Добавить роль'
}

export default function Page() {
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

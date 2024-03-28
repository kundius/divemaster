import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '@/components/admin/UserForm'
import { VespForm } from '@/components/admin/VespForm'
import { VespFormCancel } from '@/components/admin/VespFormCancel'
import { VespFormSubmit } from '@/components/admin/VespFormSubmit'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Добавить пользователя'
}

export default function Page() {
  const data = {
    username: '',
    email: '',
    fullname: '',
    password: ''
  }

  const actions: PageHeaderProps['actions'] = [
    <VespFormCancel key="back" />,
    <VespFormSubmit key="submit" />
  ]

  return (
    <VespForm<UserFormFields>
      url="admin/users"
      method="PUT"
      schema={UserFormSchema}
      defaultValues={data}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserForm />
    </VespForm>
  )
}

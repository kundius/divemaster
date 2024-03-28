import { PageHeader, PageHeaderProps } from '@/components/admin/PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '@/components/admin/UserForm'
import { VespForm } from '@/components/vesp/VespForm'
import { VespFormCancel } from '@/components/vesp/VespFormCancel'
import { VespFormSubmit } from '@/components/vesp/VespFormSubmit'
import { apiGet } from '@/lib/api'
import { withAuth } from '@/lib/api/with-auth'
import { VespUser } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать пользователя'
}

export default async function Page({ params }: { params: { id: number } }) {
  const data = await apiGet<VespUser>(`admin/users/${params.id}`, {}, withAuth())

  const actions: PageHeaderProps['actions'] = [
    <VespFormCancel key="back" />,
    <VespFormSubmit key="submit" />
  ]

  return (
    <VespForm<UserFormFields>
      url={`admin/users/${params.id}`}
      method="PATCH"
      schema={UserFormSchema}
      defaultValues={{
        email: data.email || '',
        fullname: data.fullname || '',
        role_id: data.role_id,
        username: data.username,
        password: ''
      }}
    >
      <PageHeader title={`${metadata.title}`} actions={actions} />
      <UserForm />
    </VespForm>
  )
}

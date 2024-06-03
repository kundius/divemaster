'use client'

import { useApiForm } from '@/lib/ApiForm'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserRoleForm, UserRoleFormFields, UserRoleFormSchema } from '../UserRoleForm'

export function UserRolesCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<UserRoleFormFields>({
    url: `roles`,
    method: 'POST',
    schema: UserRoleFormSchema,
    defaultValues: {
      title: '',
      scope: []
    },
    onSuccess: () => {
      router.push('/admin/user-roles')
    }
  })
  return (
    <>
      <PageHeader title="Добавить доступ" />
      <UserRoleForm form={form} onSubmit={onSubmit} />
    </>
  )
}

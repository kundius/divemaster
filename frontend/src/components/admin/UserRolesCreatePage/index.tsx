'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserRoleForm, UserRoleFormFields, UserRoleFormSchema } from '../UserRoleForm'

export function UserRolesCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<UserRoleFormFields>({
    url: `admin/user-roles`,
    method: 'PUT',
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

'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserRoleForm, UserRoleFormFields, UserRoleFormSchema } from '../UserRoleForm'
import { VespUserRole } from '@/types'

export interface UserRolesUpdatePageProps {
  initialData: VespUserRole
}

export function UserRolesUpdatePage({ initialData }: UserRolesUpdatePageProps) {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<UserRoleFormFields>({
    url: `admin/user-roles/${initialData.id}`,
    method: 'PATCH',
    schema: UserRoleFormSchema,
    defaultValues: {
      scope: initialData.scope || [],
      title: initialData.title
    },
    onSuccess: () => {
      router.push('/admin/user-roles')
    }
  })
  return (
    <>
      <PageHeader title="Редактировать доступ" />
      <UserRoleForm form={form} onSubmit={onSubmit} />
    </>
  )
}

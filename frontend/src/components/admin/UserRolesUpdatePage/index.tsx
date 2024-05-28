'use client'

import { useApiForm } from '@/components/lib/ApiForm'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserRoleForm, UserRoleFormFields, UserRoleFormSchema } from '../UserRoleForm'
import { UserRoleEntity } from '@/types'

export interface UserRolesUpdatePageProps {
  initialData: UserRoleEntity
}

export function UserRolesUpdatePage({ initialData }: UserRolesUpdatePageProps) {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<UserRoleFormFields>({
    url: `roles/${initialData.id}`,
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

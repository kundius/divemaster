'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { VespUser } from '@/types'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '../UserForm'

export interface UsersUpdatePageProps {
  initialData: VespUser
}

export function UsersUpdatePage({ initialData }: UsersUpdatePageProps) {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<UserFormFields>({
    url: `users/${initialData.id}`,
    method: 'PATCH',
    schema: UserFormSchema,
    defaultValues: {
      email: initialData.email || '',
      roleId: initialData.roleId,
      name: initialData.name,
      password: '',
      active: initialData.active
    },
    onSuccess: () => {
      router.push('/admin/users')
    }
  })
  return (
    <>
      <PageHeader title="Редактировать пользователя" />
      <UserForm form={form} onSubmit={onSubmit} />
    </>
  )
}

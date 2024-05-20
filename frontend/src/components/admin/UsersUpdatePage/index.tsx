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
    url: `admin/users/${initialData.id}`,
    method: 'PATCH',
    schema: UserFormSchema,
    defaultValues: {
      email: initialData.email || '',
      fullname: initialData.fullname || '',
      role_id: initialData.role_id,
      username: initialData.username,
      password: ''
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

'use client'

import { useApiForm } from '@/components/lib/ApiForm'
import { UserEntity } from '@/types'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '../UserForm'
import { apiGet } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'

export interface UsersUpdatePageProps {
  initialData: UserEntity
}

export function UsersUpdatePage({ initialData }: UsersUpdatePageProps) {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<UserFormFields>({
    url: `users/${initialData.id}`,
    method: 'PATCH',
    schema: UserFormSchema,
    // defaultValues: {
    //   email: initialData.email || '',
    //   roleId: initialData.role.id,
    //   name: initialData.name,
    //   password: '',
    //   active: initialData.active
    // },
    defaultValues: async () => {
      const user = await apiGet<UserEntity>(`users/${initialData.id}`, {}, withClientAuth())
      return {
        email: user.email || '',
        roleId: user.role.id,
        name: user.name,
        password: '',
        active: user.active
      }
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

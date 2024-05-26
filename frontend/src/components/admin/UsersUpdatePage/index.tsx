'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { VespUser } from '@/types'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '../UserForm'
import { useApi } from '@/lib/napi/use-api'

export interface UsersUpdatePageProps {
  initialData: VespUser
}

export function UsersUpdatePage({ initialData }: UsersUpdatePageProps) {
  const api = useApi()
  const router = useRouter()
  const [form, onSubmit] = useVespForm<UserFormFields>({
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
      const user = await api.get<VespUser>(`users/${initialData.id}`)
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

'use client'

import { useVespForm } from '@/components/vesp/VespForm'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '../UserForm'

export function UsersCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useVespForm<UserFormFields>({
    url: `admin/users`,
    method: 'PUT',
    schema: UserFormSchema,
    defaultValues: {
      username: '',
      email: '',
      fullname: '',
      password: ''
    },
    onSuccess: () => {
      router.push('/admin/users')
    }
  })
  return (
    <>
      <PageHeader title="Добавить пользователя" />
      <UserForm form={form} onSubmit={onSubmit} />
    </>
  )
}

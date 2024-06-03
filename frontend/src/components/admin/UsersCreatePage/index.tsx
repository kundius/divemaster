'use client'

import { useApiForm } from '@/lib/ApiForm'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../PageHeader'
import { UserForm, UserFormFields, UserFormSchema } from '../UserForm'

export function UsersCreatePage() {
  const router = useRouter()
  const [form, onSubmit] = useApiForm<UserFormFields>({
    url: `users`,
    method: 'POST',
    schema: UserFormSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      active: true
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

'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { UserEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserForm, UserFormFields, UserFormSchema } from './UserForm'

export function UserCreate() {
  const router = useRouter()

  const form = useForm<UserFormFields>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      active: true
    }
  })

  const onSubmit = async (values: UserFormFields) => {
    try {
      const result = await apiPost<UserEntity>(`users`, values)
      toast.success('Пользователь добавлен')
      router.push(`/dashboard/users/${result.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <UserForm />
      </form>
    </Form>
  )
}

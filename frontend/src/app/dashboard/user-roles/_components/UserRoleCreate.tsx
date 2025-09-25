'use client'

import { Form } from '@/components/ui/form'
import { apiPost } from '@/lib/api'
import { UserRoleEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserRoleForm, UserRoleFormFields, UserRoleFormSchema } from './UserRoleForm'

export function UserRoleCreate() {
  const router = useRouter()

  const form = useForm<UserRoleFormFields>({
    resolver: zodResolver(UserRoleFormSchema),
    defaultValues: {
      title: '',
      scope: []
    }
  })

  const onSubmit = async (values: UserRoleFormFields) => {
    try {
      const result = await apiPost<UserRoleEntity>(`roles`, values)
      toast.success('Доступ добавлен')
      router.push(`/dashboard/user-roles/${result.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <UserRoleForm />
      </form>
    </Form>
  )
}

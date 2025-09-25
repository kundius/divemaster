'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { UserEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserForm, UserFormFields, UserFormSchema } from './UserForm'

export interface UserUpdateProps {
  record: UserEntity
}

export function UserUpdate({ record }: UserUpdateProps) {
  const form = useForm<UserFormFields>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: record.email || '',
      roleId: record.roleId,
      name: record.name,
      password: '',
      active: record.active
    }
  })

  const onSubmit = async (values: UserFormFields) => {
    if (!record) {
      throw new Error('record not defined')
    }

    try {
      await apiPatch(`users/${record.id}`, values)

      toast.success('Пользователь изменен')
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

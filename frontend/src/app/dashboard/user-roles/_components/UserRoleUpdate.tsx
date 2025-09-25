'use client'

import { Form } from '@/components/ui/form'
import { apiPatch } from '@/lib/api'
import { UserRoleEntity } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { UserRoleForm, UserRoleFormFields, UserRoleFormSchema } from './UserRoleForm'

export interface UserRoleUpdateProps {
  record: UserRoleEntity
}

export function UserRoleUpdate({ record }: UserRoleUpdateProps) {
  const form = useForm<UserRoleFormFields>({
    resolver: zodResolver(UserRoleFormSchema),
    defaultValues: {
      scope: record.scope || [],
      title: record.title
    }
  })

  const onSubmit = async (values: UserRoleFormFields) => {
    try {
      await apiPatch(`roles/${record.id}`, values)
      toast.success('Доступ изменен')
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

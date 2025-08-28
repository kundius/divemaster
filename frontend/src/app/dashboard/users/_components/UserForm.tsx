'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { apiPatch, apiPost } from '@/lib/api'
import { UserEntity } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export const UserFormSchema = z.object({
  roleId: z.number(),
  name: z.string().trim().min(1),
  email: z.string().trim().min(1),
  password: z.string().trim(),
  active: z.boolean()
})

export type UserFormFields = z.infer<typeof UserFormSchema>

export interface UserFormProps {
  record?: UserEntity
}

export function UserForm({ record }: UserFormProps) {
  const router = useRouter()

  const form = useForm<UserFormFields>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: record
      ? {
          email: record.email || '',
          roleId: record.roleId,
          name: record.name,
          password: '',
          active: record.active
        }
      : {
          name: '',
          email: '',
          password: '',
          active: true
        }
  })

  const onSubmit = async (values: UserFormFields) => {
    if (record) {
      update(values)
    } else {
      create(values)
    }
  }

  const update = async (values: UserFormFields) => {
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

  const create = async (values: UserFormFields) => {
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
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Группа</FormLabel>
                <FormControl>
                  <ApiInputComboBox url="roles" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Пароль</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Активен</FormLabel>
                <FormControl>
                  <div className="w-full">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}

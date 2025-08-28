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
import { apiPatch, apiPost } from '@/lib/api'
import { UserRoleEntity } from '@/types'

export const UserRoleFormSchema = z.object({
  title: z.string().trim().min(1),
  scope: z.string().array().nullable()
})

export type UserRoleFormFields = z.infer<typeof UserRoleFormSchema>

export interface UserRoleFormProps {
  record?: UserRoleEntity
}

export function UserRoleForm({ record }: UserRoleFormProps) {
  const router = useRouter()

  const form = useForm<UserRoleFormFields>({
    resolver: zodResolver(UserRoleFormSchema),
    defaultValues: record
      ? {
          scope: record.scope || [],
          title: record.title
        }
      : {
          title: '',
          scope: []
        }
  })

  const onSubmit = async (values: UserRoleFormFields) => {
    if (record) {
      update(values)
    } else {
      create(values)
    }
  }

  const update = async (values: UserRoleFormFields) => {
    if (!record) {
      throw new Error('record not defined')
    }

    try {
      await apiPatch(`roles/${record.id}`, values)

      toast.success('Доступ изменен')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const create = async (values: UserRoleFormFields) => {
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
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scope"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Разрешения</FormLabel>
                <FormControl>
                  <Input
                    value={(value || []).join(', ')}
                    onChange={(e) => onChange(e.target.value.split(', '))}
                    {...field}
                  />
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

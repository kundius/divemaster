'use client'

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
import { VespInputComboBox } from '@/components/vesp/VespInputComboBox'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const UserFormSchema = z.object({
  role_id: z.number(),
  username: z.string().trim().min(1),
  email: z.string().trim().min(1),
  fullname: z.string().trim(),
  password: z.string().trim()
})

export type UserFormFields = z.infer<typeof UserFormSchema>

export interface UserFormProps {
  form: UseFormReturn<UserFormFields, any, undefined>
  onSubmit: (values: UserFormFields) => Promise<void>
}

export function UserForm({ form, onSubmit }: UserFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логин</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Группа</FormLabel>
                <FormControl>
                  <VespInputComboBox
                    url="admin/user-roles"
                    value={field.value}
                    onChange={field.onChange}
                  />
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
            name="fullname"
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
          <Button loading={form.formState.isSubmitting} type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}

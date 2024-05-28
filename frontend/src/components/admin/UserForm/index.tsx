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
import { Switch } from '@/components/ui/switch'
import { ApiInputComboBox } from '@/components/lib/ApiInputComboBox'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const UserFormSchema = z.object({
  roleId: z.number(),
  name: z.string().trim().min(1),
  email: z.string().trim().min(1),
  password: z.string().trim(),
  active: z.boolean()
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
                  <ApiInputComboBox
                    url="roles"
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
          <Button loading={form.formState.isSubmitting} type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}

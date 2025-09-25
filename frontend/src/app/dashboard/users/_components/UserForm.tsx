'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ApiInputComboBox } from '@/lib/ApiInputComboBox'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const UserFormSchema = z.object({
  roleId: z.number(),
  name: z.string().trim().min(1),
  email: z.string().trim().min(1),
  password: z.string().trim(),
  active: z.boolean()
})

export type UserFormFields = z.infer<typeof UserFormSchema>

export function UserForm() {
  const form = useFormContext<UserFormFields>()

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
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
      <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
        <Link href="/dashboard/users">
          <Button type="button" variant="outline">
            Отмена
          </Button>
        </Link>
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
          Сохранить
        </Button>
      </div>
    </div>
  )
}

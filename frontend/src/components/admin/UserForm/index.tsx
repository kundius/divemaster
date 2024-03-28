'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { VespInputComboBox } from '@/components/vesp/VespInputComboBox'
import { VespUserRole } from '@/types'

export const UserFormSchema = z.object({
  role_id: z.number(),
  username: z.string().trim().min(1),
  email: z.string().trim().min(1),
  fullname: z.string().trim(),
  password: z.string().trim()
})

export type UserFormFields = z.infer<typeof UserFormSchema>

export function UserForm() {
  const { control } = useFormContext<UserFormFields>()
  return (
    <div className="space-y-6">
      <FormField
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
        control={control}
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
    </div>
  )
}

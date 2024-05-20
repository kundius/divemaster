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
import { TagsInput } from '@/components/ui/tags-input'
import { UseFormReturn, useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const UserRoleFormSchema = z.object({
  title: z.string().trim().min(1),
  scope: z.string().array().nullable()
})

export type UserRoleFormFields = z.infer<typeof UserRoleFormSchema>

export interface UserRoleFormProps {
  form: UseFormReturn<UserRoleFormFields, any, undefined>
  onSubmit: (values: UserRoleFormFields) => Promise<void>
}

export function UserRoleForm({ form, onSubmit }: UserRoleFormProps) {
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
            render={({ field: { value, ...field } }) => (
              <FormItem>
                <FormLabel>Разрешения</FormLabel>
                <FormControl>
                  <TagsInput value={value || []} {...field} />
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

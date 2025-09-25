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
import { apiPatch } from '@/lib/api'
import { UserEntity } from '@/types'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  name: z.string(),
  password: z.string().optional(),
  email: z.string().email()
})

type FormFields = z.infer<typeof formSchema>

export interface ProfileUpdateProps {
  record: UserEntity
}

export function ProfileUpdate({ record }: ProfileUpdateProps) {
  const onSubmit = async (values: FormFields) => {
    try {
      await apiPatch('auth/profile', values)
      toast.success(`Сохранено`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    }
  }

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: record.name,
      email: record.email,
      password: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-5 rounded-md flex items-center justify-end gap-4 bg-neutral-50">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </div>
      </form>
    </Form>
  )
}

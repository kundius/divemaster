'use client'

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
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { PageHeader, PageHeaderProps } from '../PageHeader'
import { useAuthStore } from '@/providers/auth-store-provider'

const formSchema = z.object({
  name: z.string(),
  password: z.string().optional(),
  email: z.string().email()
})

type FormFields = z.infer<typeof formSchema>

export function ProfilePage() {
  const { user } = useAuthStore((state) => state)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: FormFields) => {
    setIsLoading(true)

    try {
      await apiPatch('auth/profile', values)

      toast.success(`Сохранено`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      password: ''
    }
  })

  const actions: PageHeaderProps['actions'] = [
    {
      title: 'Сохранить',
      disabled: isLoading,
      type: 'submit'
    }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PageHeader title="Профиль" actions={actions} />

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
      </form>
    </Form>
  )
}

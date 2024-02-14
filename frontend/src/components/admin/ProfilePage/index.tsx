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
import { useAuth } from '@/lib/auth/use-auth'
import { VespUser } from '@/lib/auth/types'
import { useApiForm } from '@/lib/use-api-form'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string(),
  password: z.string().optional(),
  fullname: z.string(),
  email: z.string().email()
})

type FormFields = z.infer<typeof formSchema>
type FormResult = {
  user: VespUser
}

export function ProfilePage() {
  const { user } = useAuth()

  const onSuccess = (data: FormResult) => {
    toast.success('Профиль обновлен')
  }

  const onError = (e: Error) => {
    toast.error(e.message)
  }

  const [form, onSubmit] = useApiForm<FormFields, FormResult>('user/profile', {
    method: 'PATCH',
    onSuccess,
    onError,
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email,
      fullname: user?.fullname
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Профиль</h1>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={form.formState.isLoading}>
              {form.formState.isLoading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
              Сохранить
            </Button>
          </div>
        </div>

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
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Полное имя</FormLabel>
              <FormControl>
                <Input {...field} />
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

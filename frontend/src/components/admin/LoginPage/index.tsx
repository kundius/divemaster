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
import { useApiForm } from '@/lib/use-api-form'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.'
  }),
  password: z.string().min(5, {
    message: 'Password must be at least 6 characters.'
  })
})

type FormFields = z.infer<typeof formSchema>
type FormResult = {
  token: string
}

export function LoginPage() {
  const router = useRouter()
  const auth = useAuth()

  const onSuccess = (data: FormResult) => {
    toast.success('success.login')
    auth.login(data.token)
    router.push('/admin')
  }

  const onError = (e: Error) => {
    toast.error(e.message)
  }

  const [form, onSubmit] = useApiForm<FormFields, FormResult>('security/login', {
    method: 'POST',
    onSuccess,
    onError,
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })

  return (
    <div>
      <div className="text-xl mb-6 leading-none">Вход</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Логин</FormLabel>
                <FormControl>
                  <Input placeholder="Введите логин" {...field} />
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
                  <Input placeholder="Введите пароль" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <Button type="submit" disabled={form.formState.isLoading}>
              {form.formState.isLoading && <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />}
              Войти
            </Button>
            <Button variant="link" type="button">
              Забыли пароль?
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

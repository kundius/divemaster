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
import { apiPost } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().min(2, {
    message: 'E-mail must be at least 2 characters.'
  }),
  password: z.string().min(5, {
    message: 'Password must be at least 6 characters.'
  })
})

type SignInFormFields = z.infer<typeof formSchema>
type SignInFormResult = {
  token: string
}

export function SignInForm() {
  const router = useRouter()
  const auth = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: SignInFormFields) => {
    setIsLoading(true)

    try {
      const data = await apiPost<SignInFormResult>('auth/login', values)
      toast.success('Добро пожаловать!')
      auth.login(data.token)
      router.push('/office')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<SignInFormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-80">
        <FormField
          control={form.control}
          name="email"
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
          <Button type="submit" loading={isLoading}>
            Войти
          </Button>
        </div>
      </form>
    </Form>
  )
}
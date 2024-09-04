'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { LabeledInput } from '@/components/LabeledInput'
import { Button, ButtonLoadingIcon } from '@/components/ui/button'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/providers/auth-store-provider'

import { AuthLayout } from '../AuthLayout'

export function AccessDeniedPage() {
  const login = useAuthStore((state) => state.login)
  const [pending, startTransition] = useTransition()

  const submitHandler = (formData: FormData) => {
    startTransition(async () => {
      try {
        const data = await apiPost<{ token: string }>('auth/login', {
          email: formData.get('email'),
          password: formData.get('password')
        })
        toast.success('Добро пожаловать!')
        login(data.token)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  return (
    <AuthLayout>
      <div className="space-y-2">
        <div className="font-semibold uppercase text-xl tracking-widest">Аутентификация</div>
        <div className="text-base text-muted-foreground">У вас нет доступа к данной странице.</div>
      </div>
      <form className="space-y-4 mt-6" action={submitHandler}>
        <LabeledInput type="email" name="email" label="E-mail" required />
        <LabeledInput type="password" name="password" label="Пароль" required />
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending && <ButtonLoadingIcon />}
          Войти
        </Button>
      </form>
    </AuthLayout>
  )
}

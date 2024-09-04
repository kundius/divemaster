'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/providers/auth-store-provider'
import { LabeledInput } from '@/components/LabeledInput'
import { Button, ButtonLoadingIcon } from '@/components/ui/button'

import css from './index.module.scss'

export function LoginDialog() {
  const loginDialogOpened = useAuthStore((state) => state.loginDialogOpened)
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
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
        loginDialogToggle(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  return (
    <Dialog open={loginDialogOpened} onOpenChange={loginDialogToggle}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Войдите по почте</DialogTitle>
          <DialogDescription>Только для зарегистрированных пользователей</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={submitHandler}>
          <LabeledInput type="email" name="email" label="E-mail" required />
          <LabeledInput type="password" name="password" label="Пароль" required />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending && <ButtonLoadingIcon />}
            Войти
          </Button>
          {/* <div className={css.or}>или</div>
          <Button type="button" className="w-full" size="lg" variant="secondary">
            Зарегистрироваться
          </Button> */}
        </form>
      </DialogContent>
    </Dialog>
  )
}

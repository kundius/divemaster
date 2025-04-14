'use client'

import { useState, useTransition } from 'react'
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
  const [showRegistration, setShowRegistration] = useState(false)
  const [formState, setFormState] = useState<{ [k: string]: FormDataEntryValue }>({})

  const loginDialogOpened = useAuthStore((state) => state.loginDialogOpened)
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  const login = useAuthStore((state) => state.login)
  const [pending, startTransition] = useTransition()

  const loginHandler = (formData: FormData) => {
    setFormState(Object.fromEntries(formData))
    startTransition(async () => {
      try {
        const data = await apiPost<{ token: string }>('auth/signin', {
          email: formData.get('email'),
          password: formData.get('password')
        })
        toast.success('Добро пожаловать!')
        login(data.token)
        setFormState({})
        loginDialogToggle(false)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Unknown error')
      }
    })
  }

  const registrationHandler = (formData: FormData) => {
    setFormState(Object.fromEntries(formData))
    startTransition(async () => {
      try {
        const data = await apiPost<{ token: string }>('auth/signup', {
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email'),
          password: formData.get('password'),
          passwordConfirmation: formData.get('passwordConfirmation')
        })
        toast.success('Добро пожаловать!')
        login(data.token)
        setFormState({})
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
          <DialogTitle>{showRegistration ? 'Зарегистрироваться' : 'Войти по почте'}</DialogTitle>
          <DialogDescription>
            {showRegistration
              ? 'Станьте зарегистрированным пользователем'
              : 'Только для зарегистрированных пользователей'}
          </DialogDescription>
        </DialogHeader>
        {showRegistration ? (
          <form className="space-y-4" action={registrationHandler}>
            <LabeledInput
              type="text"
              name="name"
              label="Имя и фамилия"
              required
              defaultValue={(formState['name'] as string) || ''}
            />
            <LabeledInput
              type="text"
              name="phone"
              label="Телефон"
              required
              defaultValue={(formState['phone'] as string) || ''}
            />
            <LabeledInput
              type="email"
              name="email"
              label="E-mail"
              required
              defaultValue={(formState['email'] as string) || ''}
            />
            <LabeledInput
              type="password"
              name="password"
              label="Пароль"
              required
              defaultValue={(formState['password'] as string) || ''}
            />
            <LabeledInput
              type="password"
              name="passwordConfirmation"
              label="Повторить пароль"
              required
              defaultValue={(formState['passwordConfirmation'] as string) || ''}
            />
            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              {pending && <ButtonLoadingIcon />}
              Зарегистрироваться
            </Button>
          </form>
        ) : (
          <form className="space-y-4" action={loginHandler}>
            <LabeledInput
              type="email"
              name="email"
              label="E-mail"
              required
              defaultValue={(formState['email'] as string) || ''}
            />
            <LabeledInput
              type="password"
              name="password"
              label="Пароль"
              required
              defaultValue={(formState['password'] as string) || ''}
            />
            <Button type="submit" className="w-full" size="lg" disabled={pending}>
              {pending && <ButtonLoadingIcon />}
              Войти
            </Button>
          </form>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            className="whitespace-nowrap font-medium transition-colors text-primary underline-offset-4 hover:underline text-base"
            onClick={() => setShowRegistration((prev) => !prev)}
          >
            {showRegistration ? 'Войти по почте' : 'Зарегистрироваться'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

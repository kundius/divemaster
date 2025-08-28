'use client'

import { LabeledInput } from '@/components/LabeledInput'
import { Button } from '@/components/ui/button'
import { apiPost } from '@/lib/api'
import { useAuthStore } from '@/providers/auth-store-provider'
import Image from 'next/image'
import Link from 'next/link'
import { useTransition } from 'react'
import { toast } from 'sonner'
import styles from './index.module.css'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export function AccessDenied() {
  const login = useAuthStore((state) => state.login)
  const [pending, startTransition] = useTransition()

  const submitHandler = (formData: FormData) => {
    startTransition(async () => {
      try {
        const data = await apiPost<{ token: string }>('auth/signin', {
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
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/">
          <Image src="/logo.png" alt="Divemaster Logo" width={148} height={71} priority />
        </Link>
      </div>
      <div className={styles.body}>
        <div className="space-y-2">
          <div className="font-semibold uppercase text-xl tracking-widest">Аутентификация</div>
          <div className="text-base text-muted-foreground">
            У вас нет доступа к данной странице.
          </div>
        </div>
        <form className="space-y-4 mt-6" action={submitHandler}>
          <LabeledInput type="email" name="email" label="E-mail" required />
          <LabeledInput type="password" name="password" label="Пароль" required />
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
            Войти
          </Button>
        </form>
      </div>
      <div className={styles.footer}>
        <div className={styles.copyright}>
          © 2008-{new Date().getFullYear()} &ldquo;ДАЙВМАСТЕР&rdquo;. Все права защищены
        </div>
        <div className={styles.links}>
          {/* <Link href="/">Ползовательское соглашение</Link> <Link href="/">Политика конфиденциальности</Link> */}
        </div>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/providers/auth-store-provider'
import Image from 'next/image'
import Link from 'next/link'
import styles from './index.module.css'

export function AccessDenied() {
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Link href="/">
          <Image src="/logo.png" alt="Divemaster Logo" width={148} height={71} priority />
        </Link>
      </div>
      <div className={styles.body}>
        <div className="space-y-2 mb-6">
          <div className="font-semibold uppercase text-xl tracking-widest">Нет доступа</div>
          <div className="text-base text-muted-foreground">У вас нет доступа к данной странице</div>
        </div>
        <Button type="submit" className="w-full" size="lg" onClick={() => loginDialogToggle()}>
          Авторизация
        </Button>
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

'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/providers/auth-store-provider'

import styles from './AuthButton.module.css'

export function AuthButton() {
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  return (
    <button onClick={() => loginDialogToggle(true)} className={styles.button}>
      Авторизоваться
    </button>
  )
}

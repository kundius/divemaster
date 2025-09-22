'use client'

import { PrimaryButton } from '@/components/PrimaryButton'
import { useAuthStore } from '@/providers/auth-store-provider'

export function UnauthorizedFallback() {
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p>Для доступа в личный кабинет необходимо авторизоваться.</p>
      </div>
      <PrimaryButton onClick={() => loginDialogToggle(true)}>Войти</PrimaryButton>
    </div>
  )
}

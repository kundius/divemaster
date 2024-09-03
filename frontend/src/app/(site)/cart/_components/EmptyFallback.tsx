'use client'

import { PropsWithChildren } from 'react'

import { PrimaryButton } from '@/components/site/PrimaryButton'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'
import { Headline } from '@/components/Headline'

export function EmptyFallback({ children }: PropsWithChildren) {
  const user = useAuthStore((state) => state.user)
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  const total = useCartStore((state) => state.total)

  if (total.count === 0) {
    return (
      <div className="space-y-4">
        <Headline className="mb-8" title="Корзина пуста" />
        <div className="space-y-1">
          <p>Воспользуйтесь поиском, чтобы найти всё, что нужно.</p>
          {!user && <p>Если в Корзине были товары, войдите, чтобы посмотреть список.</p>}
        </div>
        {!user && <PrimaryButton onClick={() => loginDialogToggle(true)}>Войти</PrimaryButton>}
      </div>
    )
  }

  return children
}

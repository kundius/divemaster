'use client'

import { Headline } from '@/components/Headline'
import { PrimaryButton } from '@/components/PrimaryButton'
import { useAuthStore } from '@/providers/auth-store-provider'
import { useCartStore } from '@/providers/cart-store-provider'

import { Product } from './Product'

export function Products() {
  const authUser = useAuthStore((state) => state.user)
  const loginDialogToggle = useAuthStore((state) => state.loginDialogToggle)
  const cartStore = useCartStore((state) => state)

  if (cartStore.total.count === 0) {
    return (
      <div>
        <Headline className="mb-8" title="Корзина пуста" />
        <div className="space-y-1">
          <p>Воспользуйтесь поиском, чтобы найти всё, что нужно.</p>
          {!authUser && <p>Если в Корзине были товары, войдите, чтобы посмотреть список.</p>}
        </div>
        {!authUser && (
          <div className="mt-4">
            <PrimaryButton onClick={() => loginDialogToggle(true)}>Войти</PrimaryButton>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {cartStore.cartProducts.map((item) => (
        <Product key={item.id} cartProduct={item} />
      ))}
    </div>
  )
}

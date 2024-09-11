'use client'

import { useAuthStore } from '@/providers/auth-store-provider'
import { useOrderStore } from '@/providers/order-store-provider'

import { Authorization } from './Authorization'
import { PersonalDiscount } from './PersonalDiscount'

export function Authentication() {
  const user = useAuthStore((state) => state.user)
  const personalDiscountEnabled = useOrderStore((state) => state.personalDiscountEnabled)
  const personalDiscountToggle = useOrderStore((state) => state.personalDiscountToggle)

  if (!user) {
    return <Authorization />
  }

  return (
    <PersonalDiscount
      discount={user.discount}
      checked={personalDiscountEnabled}
      onCheckedChange={personalDiscountToggle}
    />
  )
}

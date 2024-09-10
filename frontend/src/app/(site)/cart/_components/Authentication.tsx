'use client'

import { useAuthStore } from '@/providers/auth-store-provider'

import { Authorization } from './Authorization'
import { PersonalDiscount } from './PersonalDiscount'

export function Authentication() {
  const authUser = useAuthStore((state) => state.user)

  if (!authUser) {
    return <Authorization />
  }

  return <PersonalDiscount />
}

'use client'

import { useState } from 'react'

import { useAuthStore } from '@/providers/auth-store-provider'

import { Authorization } from './Authorization'
import { PersonalDiscount } from './PersonalDiscount'

export function Authentication() {
  const authUser = useAuthStore((state) => state.user)
  const [personalDiscount, setPersonalDiscount] = useState(false)

  if (!authUser) {
    return <Authorization />
  }
  return <PersonalDiscount checked={personalDiscount} onCheckedChange={setPersonalDiscount} />
}

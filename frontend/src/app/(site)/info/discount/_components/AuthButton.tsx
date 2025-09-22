'use client'

import { PrimaryButton } from '@/components/PrimaryButton'
import { useAuthStore } from '@/providers/auth-store-provider'
import { PropsWithChildren } from 'react'

export function AuthButton({ children }: PropsWithChildren) {
  const loginDialogToggle = useAuthStore((store) => store.loginDialogToggle)
  return <PrimaryButton onClick={() => loginDialogToggle()}>{children}</PrimaryButton>
}

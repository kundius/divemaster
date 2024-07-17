'use client'

import { useAuthStore } from '@/providers/auth-store-provider'
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'

export interface HasScopeProps {
  fallback?: ReactNode
  scopes: string | string[]
}

export function HasScope({ children, fallback, scopes }: PropsWithChildren<HasScopeProps>) {
  const { hasScope } = useAuthStore((state) => state)

  if (!hasScope(scopes)) {
    return fallback
  }

  return children
}

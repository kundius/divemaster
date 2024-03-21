'use client'

import { useAuth } from '@/lib/auth/use-auth'
import type { PropsWithChildren, ReactElement, ReactNode } from 'react'

export interface HasScopeProps {
  fallback?: ReactNode
  scopes: string | string[]
}

export function HasScope({ children, fallback, scopes }: PropsWithChildren<HasScopeProps>) {
  const { hasScope } = useAuth()

  if (!hasScope(scopes)) {
    return fallback
  }

  return children
}

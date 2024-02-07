'use client'

import { useAuth } from '@/lib/auth'
import type { PropsWithChildren, ReactElement } from 'react'

export interface HasScopeProps {
  fallback?: ReactElement
  scopes: string | string[]
}

export function HasScope({ children, fallback, scopes }: PropsWithChildren<HasScopeProps>) {
  const { hasScope } = useAuth()

  if (!hasScope(scopes)) {
    return fallback
  }

  return children
}

'use client'

import { PropsWithChildren } from 'react'
import { SWRConfig, SWRConfiguration } from 'swr'

export function SWRFallbackProvider({
  children,
  fallback
}: PropsWithChildren<{ fallback?: SWRConfiguration['fallback'] }>) {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>
}

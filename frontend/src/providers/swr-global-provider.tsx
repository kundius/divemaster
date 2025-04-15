'use client'

import { apiGet } from '@/lib/api'
import { PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'

export function SWRGlobalProvider({ children }: PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        fetcher: async (resource: string | [string, Record<string, any>]) => {
          if (typeof resource === 'string') {
            resource = [resource, {}]
          }
          if (resource.length !== 2) {
            throw new Error('resource must be string | [string, Record<string, any>]')
          }
          return apiGet(...resource)
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}

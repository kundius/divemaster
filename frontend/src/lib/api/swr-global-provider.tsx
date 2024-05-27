'use client'

import { PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'
import { apiGet } from '.'
import { withClientAuth } from './with-client-auth'

export function SWRGlobalProvider({ children }: PropsWithChildren) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource: string | [string, Record<string, any>]) => {
          if (typeof resource === 'string') {
            resource = [resource, {}]
          }
          if (resource.length !== 2) {
            throw new Error('resource must be string | [string, Record<string, any>]')
          }
          return apiGet(...resource, withClientAuth())
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}

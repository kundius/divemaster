'use client'

import { PropsWithChildren } from 'react'
import { SWRConfig } from 'swr'
import { apiGet } from '.'
import { withClientAuth } from './with-client-auth'
import { ApiClient } from '../api-client'

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
          const api = new ApiClient()
          await api.withClientAuth()
          return api.get(...resource)
        }
      }}
    >
      {children}
    </SWRConfig>
  )
}

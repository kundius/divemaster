'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import useSWR from 'swr'

import { OrderEntity } from '@/types'

export interface OrderDetailsQueryStore {
  data: OrderEntity
  refetch: () => Promise<void>
}

export const OrderDetailsContext = createContext<OrderDetailsQueryStore | undefined>(undefined)

export interface OrderDetailsProviderProps {
  hash: string
  fallbackData: OrderEntity
}

export function OrderDetailsProvider({
  hash,
  fallbackData,
  children
}: PropsWithChildren<OrderDetailsProviderProps>) {
  const { data, mutate } = useSWR<OrderEntity>([`order/hash:${hash}`, {}], {
    fallbackData
  })

  const refetch = async () => {
    await mutate(data, { revalidate: true })
  }

  return (
    <OrderDetailsContext.Provider
      value={{
        data: data || fallbackData,
        refetch
      }}
    >
      {children}
    </OrderDetailsContext.Provider>
  )
}

export const useOrderDetails = (): OrderDetailsQueryStore => {
  const context = useContext(OrderDetailsContext)

  if (!context) {
    throw new Error(`useOrderDetailsQuery must be used within OrderDetailsProvider`)
  }

  return context
}

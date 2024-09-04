'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { createOrderStore, OrderActions, OrderState } from '@/stores/order-store'

export type OrderStoreApi = ReturnType<typeof createOrderStore>

export const OrderStoreContext = createContext<OrderStoreApi | undefined>(undefined)

export interface OrderStoreProviderProps {
  children: ReactNode
}

export const OrderStoreProvider = ({ children }: OrderStoreProviderProps) => {
  const storeRef = useRef<OrderStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createOrderStore()
  }

  return (
    <OrderStoreContext.Provider value={storeRef.current}>{children}</OrderStoreContext.Provider>
  )
}

export const useOrderStore = <T,>(selector: (store: OrderState & OrderActions) => T): T => {
  const context = useContext(OrderStoreContext)

  if (!context) {
    throw new Error(`useOrderStore must be used within OrderStoreProvider`)
  }

  return useStore(context, selector)
}

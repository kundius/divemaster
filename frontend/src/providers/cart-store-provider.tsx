'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { type CartStore, createCartStore, initCartStore } from '@/stores/cart-store'

export type CartStoreApi = ReturnType<typeof createCartStore>

export const CartStoreContext = createContext<CartStoreApi | undefined>(undefined)

export interface CartStoreProviderProps {
  children: ReactNode
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const storeRef = useRef<CartStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCartStore(initCartStore())
  }

  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>
}

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
  const context = useContext(CartStoreContext)

  if (!context) {
    throw new Error(`useCartStore must be used within CartStoreProvider`)
  }

  return useStore(context, selector)
}

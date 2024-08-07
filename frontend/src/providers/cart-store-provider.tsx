'use client'

import { type ReactNode, createContext, useContext, useLayoutEffect, useRef } from 'react'
import { useStore } from 'zustand'

import { apiPost } from '@/lib/api'
import { withClientAuth } from '@/lib/api/with-client-auth'
import { type CartStore, createCartStore } from '@/stores/cart-store'
import { useAuthStore } from './auth-store-provider'

export type CartStoreApi = ReturnType<typeof createCartStore>

export const CartStoreContext = createContext<CartStoreApi | undefined>(undefined)

export interface CartStoreProviderProps {
  children: ReactNode
}

export const CartStoreProvider = ({ children }: CartStoreProviderProps) => {
  const auth = useAuthStore((state) => state)

  const storeRef = useRef<CartStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createCartStore()
  }

  useLayoutEffect(() => {
    const store = storeRef.current

    if (!store) return

    const currentCartId = store.getState().cartId
    let cartId: string | null = localStorage.getItem('cartId')

    if (auth.user && auth.user.cart) {
      cartId = auth.user.cart.id
    }

    if (auth.user && !auth.user.cart && cartId) {
      apiPost(`cart/${cartId}`, {}, withClientAuth())
      localStorage.removeItem('cartId')
    }

    if (currentCartId !== cartId) {
      store.setState({ cartId })
      store.getState().loadCart()
    }
  }, [auth.user])

  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>
}

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
  const context = useContext(CartStoreContext)

  if (!context) {
    throw new Error(`useCartStore must be used within CartStoreProvider`)
  }

  return useStore(context, selector)
}

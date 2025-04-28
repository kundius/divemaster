'use client'

import { type ReactNode, createContext, useContext, useLayoutEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { apiPost } from '@/lib/api'
import { WichlistActions, WichlistState, createWichlistStore } from '@/stores/wichlist-store'
import { useAuthStore } from './auth-store-provider'

export type WichlistStoreApi = ReturnType<typeof createWichlistStore>

export const WichlistStoreContext = createContext<WichlistStoreApi | undefined>(undefined)

export interface WichlistStoreProviderProps {
  children: ReactNode
}

export const WichlistStoreProvider = ({ children }: WichlistStoreProviderProps) => {
  const auth = useAuthStore((state) => state)

  const storeRef = useRef<WichlistStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createWichlistStore()
  }

  useLayoutEffect(() => {
    const store = storeRef.current

    if (!store) return

    const currentCartId = store.getState().cartId
    let cartId: string | null = localStorage.getItem('cartId')

    if (auth.user && auth.user.cart) {
      cartId = auth.user.cart.id
    }

    // если у пользователя корзины нет, но есть гостевая- прикрепить ее к пользователю
    if (auth.user && !auth.user.cart && cartId) {
      apiPost(`cart/${cartId}`)
      localStorage.removeItem('cartId')
    }

    // если в результате смены пользователя поменялась корзина обновить её в сторе
    if (currentCartId !== cartId) {
      store.setState({ cartId })
      store.getState().loadCart()
    }
  }, [auth.user])

  return (
    <WichlistStoreContext.Provider value={storeRef.current}>
      {children}
    </WichlistStoreContext.Provider>
  )
}

export const useWichlistStore = <T,>(
  selector: (store: WichlistState & WichlistActions) => T
): T => {
  const context = useContext(WichlistStoreContext)

  if (!context) {
    throw new Error(`useWichlistStore must be used within WichlistStoreProvider`)
  }

  return useStore(context, selector)
}

'use client'

import { type ReactNode, createContext, useContext, useLayoutEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { apiPost } from '@/lib/api'
import { WichlistActions, WichlistState, createWichlistStore } from '@/stores/wichlist-store'
import { useAuthStore } from './auth-store-provider'
import { WishlistType } from '@/types'

export type WichlistStoreApi = ReturnType<typeof createWichlistStore>

export const WichlistStoreContext = createContext<WichlistStoreApi | undefined>(undefined)

export interface WichlistStoreProviderProps {
  children: ReactNode
}

export const WichlistStoreProvider = ({ children }: WichlistStoreProviderProps) => {
  const user = useAuthStore((state) => state.user)

  const storeRef = useRef<WichlistStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createWichlistStore()
  }

  useLayoutEffect(() => {
    // после логаута нужно удалить ид списков из стора
    const store = storeRef.current

    if (!store) return

    const currentIds = store.getState().ids

    const types = Object.values(WishlistType)
    for (const type of types) {
      let localId = localStorage.getItem(`wishlist:${type}`)

      if (user) {
        const wishlist = user.wishlists.find((i) => i.type === type)
        if (wishlist) {
          localId = wishlist.id
        } else if (localId) {
          apiPost(`wishlist/${type}/${localId}`)
          localStorage.removeItem(`wishlist:${type}`)
        }
      }

      if (currentIds[type] !== localId) {
        store.setState((prev) => ({ ids: { ...prev.ids, [type]: localId } }))
        store.getState().loadWishlist(type)
      }
    }
  }, [user])

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

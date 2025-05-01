'use client'

import { type ReactNode, createContext, useContext, useLayoutEffect, useRef } from 'react'
import { useStore } from 'zustand'
import { apiPost } from '@/lib/api'
import { WishlistActions, WishlistState, createWishlistStore } from '@/stores/wishlist-store'
import { useAuthStore } from './auth-store-provider'
import { WishlistType } from '@/types'

export type WishlistStoreApi = ReturnType<typeof createWishlistStore>

export const WishlistStoreContext = createContext<WishlistStoreApi | undefined>(undefined)

export interface WishlistStoreProviderProps {
  children: ReactNode
}

export const WishlistStoreProvider = ({ children }: WishlistStoreProviderProps) => {
  const user = useAuthStore((state) => state.user)

  const storeRef = useRef<WishlistStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createWishlistStore()
  }

  useLayoutEffect(() => {
    // после логаута нужно удалить ид списков из стора
    const store = storeRef.current

    if (!store) return

    const ids = store.getState().ids

    const types = Object.values(WishlistType)
    for (const type of types) {
      let id = localStorage.getItem(`wishlist:${type}`)

      if (user) {
        const wishlist = user.wishlists.find((i) => i.type === type)
        if (wishlist) {
          id = wishlist.id
        } else if (id) {
          // авторизация списка
          apiPost(`wishlist/${type}/${id}`)
          // теперь это авторизованный список
          localStorage.removeItem(`wishlist:${type}`)
        }
      }

      // если ид списка изменился запоминаем его и загружаем
      if (ids[type] !== id) {
        store.getState().setWishlistId(id, type)
        store.getState().loadWishlist(type)
      }
    }
  }, [user])

  return (
    <WishlistStoreContext.Provider value={storeRef.current}>
      {children}
    </WishlistStoreContext.Provider>
  )
}

export const useWishlistStore = <T,>(
  selector: (store: WishlistState & WishlistActions) => T
): T => {
  const context = useContext(WishlistStoreContext)

  if (!context) {
    throw new Error(`useWichlistStore must be used within WichlistStoreProvider`)
  }

  return useStore(context, selector)
}

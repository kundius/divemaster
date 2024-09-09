'use client'

import { type ReactNode, createContext, useContext, useLayoutEffect, useRef } from 'react'
import { useStore } from 'zustand'

import { AuthActions, AuthState, createAuthStore } from '@/stores/auth-store'
import { UserEntity } from '@/types'

export type AuthStoreApi = ReturnType<typeof createAuthStore>

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(undefined)

export interface AuthStoreProviderProps {
  children: ReactNode
  initialUser?: UserEntity
}

export const AuthStoreProvider = ({ children, initialUser }: AuthStoreProviderProps) => {
  const storeRef = useRef<AuthStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createAuthStore(initialUser)
  }

  useLayoutEffect(() => {
    const store = storeRef.current

    if (!store) return

    if (!initialUser) {
      store.getState().loadUser()
    }
  }, [])

  return <AuthStoreContext.Provider value={storeRef.current}>{children}</AuthStoreContext.Provider>
}

export const useAuthStore = <T,>(selector: (store: AuthState & AuthActions) => T): T => {
  const context = useContext(AuthStoreContext)

  if (!context) {
    throw new Error(`useAuthStore must be used within AuthStoreProvider`)
  }

  return useStore(context, selector)
}

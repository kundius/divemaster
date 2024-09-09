'use client'

import { type ReactNode, createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

import { createLocationStore, LocationActions, LocationState } from '@/stores/location-store'

export type LocationStoreApi = ReturnType<typeof createLocationStore>

export const LocationStoreContext = createContext<LocationStoreApi | undefined>(undefined)

export interface LocationStoreProviderProps {
  children: ReactNode
}

export const LocationStoreProvider = ({ children }: LocationStoreProviderProps) => {
  const storeRef = useRef<LocationStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createLocationStore()
    // Почему-то если не вызвать эту функцию, то сперва видно состояние по умолчанию.
    // Но учитывая что состояние запоминается в локалстораж, оно может быть восстановлено до создания стора
    // но как то странно работает, влияет на другой стор, пользователь появляется быстрее
    // storeRef.current.persist.hasHydrated()
  }

  return (
    <LocationStoreContext.Provider value={storeRef.current}>
      {children}
    </LocationStoreContext.Provider>
  )
}

export const useLocationStore = <T,>(
  selector: (store: LocationState & LocationActions) => T
): T => {
  const context = useContext(LocationStoreContext)

  if (!context) {
    throw new Error(`useLocationStore must be used within LocationStoreProvider`)
  }

  return useStore(context, selector)
}
